import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createApp } from './app.mjs';
import { projectData } from './validation.mjs';

const origin = 'http://127.0.0.1:3001';
const png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j2fQAAAAASUVORK5CYII=';
const text = value => ({ type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: value }] }] });
const data = (hero = '') => ({ title: 'Daily life', subtitle: 'A research project', authors: 'Hongni', hero, heroAlt: 'Concept', leader: 'Hongni', supervisor: 'Mirjana', sections: [{ id: 'overview', layout: 'text', heading: 'Overview', body: text('High-level project description'), images: [], linkLabel: '', linkUrl: '' }] });
let app, directory, base;
before(async () => {
  directory = await mkdtemp(join(tmpdir(), 'fearlab-api-'));
  app = await createApp({ dataDir: directory, allowedOrigins: [origin] });
  await new Promise((resolve, reject) => { app.server.once('error', reject); app.server.listen(0, '127.0.0.1', resolve); });
  base = `http://127.0.0.1:${app.server.address().port}`;
});
after(async () => { await app.close(); await rm(directory, { recursive: true, force: true }); });
async function request(path, { method = 'GET', body, auth, extra = {} } = {}) {
  const response = await fetch(`${base}${path}`, { method, headers: { ...(method !== 'GET' ? { Origin: origin, 'Content-Type': 'application/json' } : {}), ...(auth ? { Cookie: auth.cookie, 'X-CSRF-Token': auth.csrfToken } : {}), ...extra }, ...(body !== undefined ? { body: JSON.stringify(body) } : {}) });
  const contentType = response.headers.get('content-type') ?? '';
  return { status: response.status, body: contentType.includes('json') ? await response.json() : Buffer.from(await response.arrayBuffer()), cookie: response.headers.get('set-cookie')?.split(';')[0], headers: response.headers };
}
async function login(username, password = '123456') {
  const result = await request('/api/auth/login', { method: 'POST', body: { username, password } });
  assert.equal(result.status, 200);
  return { ...result.body, cookie: result.cookie };
}
async function activate(username) {
  const initial = await login(username);
  const changed = await request('/api/auth/password', { method: 'POST', auth: initial, body: { currentPassword: '123456', newPassword: 'A-specific-new-password!' } });
  assert.equal(changed.status, 200);
  return { ...changed.body, cookie: changed.cookie };
}
let owner, other, admin, mirjana, image, project;
test('gallery image identities survive validation and duplicate drag identities are rejected', () => {
  const material = data();
  material.sections[0].images = [{ id: 'image-one', url: '', alt: 'First', caption: '' }, { id: 'image-two', url: '', alt: 'Second', caption: '' }];
  assert.deepEqual(projectData(material).sections[0].images.map(image => image.id), ['image-one', 'image-two']);
  material.sections[0].images[1].id = 'image-one';
  assert.throws(() => projectData(material), /Image IDs must be unique/);
});
test('origin checks, case-insensitive login, optional password changes, CSRF, rotation and hashed sessions', async () => {
  assert.equal((await request('/api/auth/login', { method: 'POST', body: { username: 'Primo', password: '123456' }, extra: { Origin: 'https://evil.example' } })).status, 403);
  const initial = await login('hOnGnI');
  assert.equal(initial.user.usingInitialPassword, true);
  assert.equal((await request('/api/projects', { auth: initial })).status, 200);
  assert.equal('mustChangePassword' in initial.user, false);
  assert.equal((await request('/api/auth/session', { auth: initial })).body.user.usingInitialPassword, true);
  assert.equal((await request('/api/auth/password', { method: 'POST', auth: initial, body: { currentPassword: '123456', newPassword: 'A-specific-new-password!' }, extra: { 'X-CSRF-Token': 'wrong' } })).status, 403);
  const changed = await request('/api/auth/password', { method: 'POST', auth: initial, body: { currentPassword: '123456', newPassword: 'A-specific-new-password!' } });
  assert.equal(changed.status, 200);
  owner = { ...changed.body, cookie: changed.cookie };
  assert.equal(owner.user.usingInitialPassword, false);
  assert.notEqual(owner.cookie, initial.cookie);
  assert.equal((await request('/api/auth/session', { auth: initial })).body.user, null);
  assert.match(changed.headers.get('set-cookie'), /HttpOnly; SameSite=Strict/);
  const row = app.db.prepare('SELECT * FROM users WHERE id=?').get('hongni');
  assert.notEqual(row.password_hash, 'A-specific-new-password!');
  const token = owner.cookie.split('=')[1];
  assert.equal(app.db.prepare('SELECT COUNT(*) AS count FROM sessions WHERE token_hash=?').get(token).count, 0);
  other = await activate('Mengxu'); admin = await activate('Dongyijie'); mirjana = await activate('mIrJaNa');
  assert.equal(admin.user.username, 'primo'); assert.equal(admin.user.role, 'admin');
  assert.equal(mirjana.user.username, 'mirjana'); assert.equal(mirjana.user.role, 'admin');
});
test('uploads check real image signatures and keep unpublished files private', async () => {
  const uploaded = await request('/api/uploads', { method: 'POST', auth: owner, body: { name: 'concept.png', data: png } });
  assert.equal(uploaded.status, 201); image = uploaded.body.url;
  assert.equal((await request(image)).status, 404);
  const unchanged = await login('Xingyu');
  assert.equal((await request(image, { auth: unchanged })).status, 404);
  assert.equal((await request(image, { auth: other })).status, 404);
  const actual = await request(image, { auth: owner });
  assert.equal(actual.status, 200); assert.equal(actual.headers.get('content-type'), 'image/png');
  assert.equal((await request(image, { auth: admin })).status, 200);
  for (const bytes of [Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>'), Buffer.from('<html><script>alert(1)</script></html>'), Buffer.from(png, 'base64').subarray(0, 40)]) {
    assert.equal((await request('/api/uploads', { method: 'POST', auth: owner, body: { name: 'trick.png', data: bytes.toString('base64') } })).status, 400);
  }
  assert.equal((await request('/api/uploads', { method: 'POST', auth: owner, body: { name: 'large.png', data: Buffer.alloc(8 * 1024 * 1024 + 1).toString('base64') } })).status, 413);
});
test('draft ownership and safe URLs are enforced server-side', async () => {
  const created = await request('/api/projects', { method: 'POST', auth: owner, body: { project: data(image) } });
  assert.equal(created.status, 201); project = created.body.project;
  assert.equal(project.status, 'draft'); assert.equal(project.ownerId, owner.user.id);
  assert.equal((await request('/api/projects', { auth: other })).body.projects.length, 0);
  assert.equal((await request(`/api/projects/${project.id}`, { auth: other })).status, 404);
  assert.equal((await request(`/api/projects/${project.id}`, { method: 'PATCH', auth: other, body: { project: data(image), version: project.version } })).status, 404);
  assert.equal((await request('/api/projects', { method: 'POST', auth: other, body: { project: data(image) } })).status, 400);
  assert.equal((await request('/api/public/projects')).body.projects.length, 0);
  const malicious = data(image); malicious.sections[0].linkUrl = 'javascript:alert(1)';
  assert.equal((await request(`/api/projects/${project.id}`, { method: 'PATCH', auth: owner, body: { project: malicious, version: project.version } })).status, 400);
  malicious.sections[0].linkUrl = ''; malicious.sections[0].body.content[0].content[0].marks = [{ type: 'link', attrs: { href: 'javascript:alert(1)' } }];
  assert.equal((await request(`/api/projects/${project.id}`, { method: 'PATCH', auth: owner, body: { project: malicious, version: project.version } })).status, 400);
  const incomplete = await request('/api/projects', { method: 'POST', auth: other, body: { project: { sections: [] } } });
  assert.equal(incomplete.status, 201);
  assert.equal((await request(`/api/projects/${incomplete.body.project.id}/submit`, { method: 'POST', auth: other, body: { version: 1 } })).status, 400);
});
test('both administrators see every proposal while members see only their own', async () => {
  const ownersProjects = (await request('/api/projects', { auth: owner })).body.projects;
  const othersProjects = (await request('/api/projects', { auth: other })).body.projects;
  assert.ok(ownersProjects.length > 0); assert.ok(othersProjects.length > 0);
  assert.ok(ownersProjects.every(item => item.ownerId === owner.user.id));
  assert.ok(othersProjects.every(item => item.ownerId === other.user.id));
  const expectedIds = [...ownersProjects, ...othersProjects].map(item => item.id).sort();
  for (const reviewer of [admin, mirjana]) {
    const response = await request('/api/projects', { auth: reviewer });
    assert.equal(response.status, 200);
    assert.deepEqual(response.body.projects.map(item => item.id).sort(), expectedIds);
    for (const id of expectedIds) assert.equal((await request(`/api/projects/${id}`, { auth: reviewer })).status, 200);
  }
  assert.equal((await request(`/api/projects/${othersProjects[0].id}`, { auth: owner })).status, 404);
  assert.equal((await request(`/api/projects/${ownersProjects[0].id}`, { auth: other })).status, 404);
});

test('initial-password members can create, upload and submit without gaining extra permissions', async () => {
  const initial = await login('Qiyuan');
  assert.equal(initial.user.usingInitialPassword, true);
  assert.equal((await request(`/api/projects/${project.id}`, { auth: initial })).status, 404);
  assert.equal((await request(image, { auth: initial })).status, 404);
  const uploaded = await request('/api/uploads', { method: 'POST', auth: initial, body: { name: 'initial-account.png', data: png } });
  assert.equal(uploaded.status, 201);
  const ownedImage = uploaded.body.url;
  assert.equal((await request(ownedImage, { auth: initial })).status, 200);
  assert.equal((await request(ownedImage)).status, 404);
  assert.equal((await request(ownedImage, { auth: other })).status, 404);
  assert.equal((await request('/api/projects', { method: 'POST', auth: initial, extra: { 'X-CSRF-Token': 'wrong' }, body: { project: data(ownedImage) } })).status, 403);
  const created = await request('/api/projects', { method: 'POST', auth: initial, body: { project: { ...data(ownedImage), authors: initial.user.name } } });
  assert.equal(created.status, 201);
  const draft = created.body.project;
  assert.equal(draft.ownerId, initial.user.id);
  const listed = await request('/api/projects', { auth: initial });
  assert.equal(listed.status, 200);
  assert.deepEqual(listed.body.projects.map(item => item.id), [draft.id]);
  const submitted = await request(`/api/projects/${draft.id}/submit`, { method: 'POST', auth: initial, body: { version: draft.version } });
  assert.equal(submitted.status, 200);
  assert.equal(submitted.body.project.status, 'submitted');
  assert.equal((await request(`/api/projects/${draft.id}/review`, { method: 'POST', auth: initial, body: { version: submitted.body.project.version, decision: 'approve', feedback: '' } })).status, 403);
  assert.equal((await request(`/api/public/projects/${draft.id}`)).status, 404);
  assert.equal((await request('/api/auth/session', { auth: initial })).body.user.usingInitialPassword, true);
  assert.equal(app.db.prepare('SELECT must_change FROM users WHERE id=?').get(initial.user.id).must_change, 1);
});

test('authors can withdraw submissions by editing, then either administrator can approve a resubmission', async () => {
  for (const reviewer of [admin, mirjana]) {
    const created = await request('/api/projects', { method: 'POST', auth: owner, body: { project: { ...data(image), title: `Proposal for ${reviewer.user.name}` } } });
    assert.equal(created.status, 201);
    let proposal = created.body.project;
    const submitted = await request(`/api/projects/${proposal.id}/submit`, { method: 'POST', auth: owner, body: { version: proposal.version } });
    assert.equal(submitted.status, 200); proposal = submitted.body.project;
    const reviewVersion = proposal.version;
    const revisedTitle = `Revised for ${reviewer.user.name}`;
    const edited = await request(`/api/projects/${proposal.id}`, { method: 'PATCH', auth: owner, body: { version: reviewVersion, project: { ...proposal.data, title: revisedTitle } } });
    assert.equal(edited.status, 200); proposal = edited.body.project;
    assert.equal(proposal.status, 'draft');
    assert.equal(proposal.version, reviewVersion + 1);
    assert.equal(proposal.data.title, revisedTitle);
    assert.equal((await request(`/api/projects/${proposal.id}/review`, { method: 'POST', auth: reviewer, body: { version: reviewVersion, decision: 'approve', feedback: '' } })).status, 409);
    assert.equal((await request(`/api/projects/${proposal.id}/review`, { method: 'POST', auth: reviewer, body: { version: proposal.version, decision: 'approve', feedback: '' } })).status, 409);
    assert.equal((await request(`/api/public/projects/${proposal.id}`)).status, 404);
    assert.equal((await request('/api/public/projects')).body.projects.some(item => item.id === proposal.id), false);
    const resubmitted = await request(`/api/projects/${proposal.id}/submit`, { method: 'POST', auth: owner, body: { version: proposal.version } });
    assert.equal(resubmitted.status, 200); proposal = resubmitted.body.project;
    assert.equal(proposal.status, 'submitted');
    const approved = await request(`/api/projects/${proposal.id}/review`, { method: 'POST', auth: reviewer, body: { version: proposal.version, decision: 'approve', feedback: 'Reviewed privately' } });
    assert.equal(approved.status, 200); proposal = approved.body.project;
    assert.equal(proposal.status, 'approved');
    const publicDetail = await request(`/api/public/projects/${proposal.id}`);
    assert.equal(publicDetail.status, 200);
    assert.equal(publicDetail.body.project.data.title, revisedTitle);
    const publicEntry = (await request('/api/public/projects')).body.projects.find(item => item.id === proposal.id);
    assert.deepEqual(publicEntry, publicDetail.body.project);
    assert.equal('feedback' in publicEntry, false);

    // A submitted revision can also be withdrawn without changing the live snapshot.
    const liveSnapshot = publicDetail.body.project;
    const newUpload = await request('/api/uploads', { method: 'POST', auth: owner, body: { name: 'revision.png', data: png } });
    const revised = await request(`/api/projects/${proposal.id}`, { method: 'PATCH', auth: owner, body: { version: proposal.version, project: { ...proposal.data, title: 'Unapproved revision', hero: newUpload.body.url } } });
    assert.equal(revised.status, 200); proposal = revised.body.project;
    assert.equal(proposal.status, 'draft');
    proposal = (await request(`/api/projects/${proposal.id}/submit`, { method: 'POST', auth: owner, body: { version: proposal.version } })).body.project;
    const revisionReviewVersion = proposal.version;
    const withdrawn = await request(`/api/projects/${proposal.id}`, { method: 'PATCH', auth: owner, body: { version: proposal.version, project: { ...proposal.data, title: 'Revised while awaiting review' } } });
    assert.equal(withdrawn.status, 200); proposal = withdrawn.body.project;
    assert.equal(proposal.status, 'draft');
    assert.equal(proposal.version, revisionReviewVersion + 1);
    assert.equal((await request(`/api/projects/${proposal.id}/review`, { method: 'POST', auth: reviewer, body: { version: revisionReviewVersion, decision: 'approve', feedback: '' } })).status, 409);
    assert.deepEqual((await request(`/api/public/projects/${proposal.id}`)).body.project, liveSnapshot);
    assert.deepEqual((await request('/api/public/projects')).body.projects.find(item => item.id === proposal.id), liveSnapshot);
    assert.equal((await request(newUpload.body.url)).status, 404);
    const latestSubmission = await request(`/api/projects/${proposal.id}/submit`, { method: 'POST', auth: owner, body: { version: proposal.version } });
    assert.equal(latestSubmission.status, 200); proposal = latestSubmission.body.project;
    const latestApproval = await request(`/api/projects/${proposal.id}/review`, { method: 'POST', auth: reviewer, body: { version: proposal.version, decision: 'approve', feedback: '' } });
    assert.equal(latestApproval.status, 200);
    assert.equal((await request(`/api/public/projects/${proposal.id}`)).body.project.data.title, 'Revised while awaiting review');
    assert.equal((await request('/api/public/projects')).body.projects.find(item => item.id === proposal.id).data.hero, newUpload.body.url);
    assert.equal((await request(newUpload.body.url)).status, 200);
  }
});

test('review state, admin edits, stale versions and double approval are protected', async () => {
  const submitted = await request(`/api/projects/${project.id}/submit`, { method: 'POST', auth: owner, body: { version: project.version } });
  assert.equal(submitted.status, 200); project = submitted.body.project;
  assert.equal((await request(`/api/projects/${project.id}/review`, { method: 'POST', auth: owner, body: { decision: 'approve', feedback: '', version: project.version } })).status, 403);
  const edited = await request(`/api/projects/${project.id}`, { method: 'PATCH', auth: admin, body: { project: { ...project.data, title: 'Reviewed title' }, version: project.version } });
  assert.equal(edited.status, 200); assert.equal(edited.body.project.status, 'submitted');
  assert.equal((await request(`/api/projects/${project.id}/review`, { method: 'POST', auth: admin, body: { decision: 'approve', feedback: '', version: project.version } })).status, 409);
  project = edited.body.project;
  const approvals = await Promise.all([1, 2].map(() => request(`/api/projects/${project.id}/review`, { method: 'POST', auth: admin, body: { decision: 'approve', feedback: '', version: project.version } })));
  assert.deepEqual(approvals.map(r => r.status).sort(), [200, 409]);
  project = approvals.find(r => r.status === 200).body.project;
  assert.equal(project.status, 'approved');
  assert.equal((await request(`/api/public/projects/${project.id}`)).body.project.data.title, 'Reviewed title');
  assert.equal('feedback' in (await request(`/api/public/projects/${project.id}`)).body.project, false);
  assert.equal((await request(image)).status, 200);
});
test('pending revisions keep an immutable published snapshot and expose no new private images', async () => {
  const uploaded = await request('/api/uploads', { method: 'POST', auth: owner, body: { name: 'new.png', data: png } });
  const unpublishedImage = uploaded.body.url;
  const edited = await request(`/api/projects/${project.id}`, { method: 'PATCH', auth: owner, body: { project: { ...project.data, title: 'Private new draft', hero: unpublishedImage }, version: project.version } });
  assert.equal(edited.status, 200); project = edited.body.project; assert.equal(project.status, 'draft');
  assert.equal((await request(`/api/public/projects/${project.id}`)).body.project.data.title, 'Reviewed title');
  assert.equal((await request(unpublishedImage)).status, 404);
  project = (await request(`/api/projects/${project.id}/submit`, { method: 'POST', auth: owner, body: { version: project.version } })).body.project;
  const changes = await request(`/api/projects/${project.id}/review`, { method: 'POST', auth: admin, body: { version: project.version, decision: 'changes', feedback: 'Please explain the study scope.' } });
  assert.equal(changes.status, 200); project = changes.body.project; assert.equal(project.status, 'changes');
  assert.equal((await request(`/api/public/projects/${project.id}`)).body.project.data.title, 'Reviewed title');
});
test('admin-added project media remains accessible and editable by the project owner', async () => {
  const uploaded = await request('/api/uploads', { method: 'POST', auth: admin, body: { name: 'admin.png', data: png } });
  const saved = await request(`/api/projects/${project.id}`, { method: 'PATCH', auth: admin, body: { project: { ...project.data, hero: uploaded.body.url }, version: project.version } });
  assert.equal(saved.status, 200); project = saved.body.project;
  assert.equal((await request(uploaded.body.url, { auth: owner })).status, 200);
  assert.equal((await request(uploaded.body.url, { auth: other })).status, 404);
  const ownerSave = await request(`/api/projects/${project.id}`, { method: 'PATCH', auth: owner, body: { project: project.data, version: project.version } });
  assert.equal(ownerSave.status, 200); project = ownerSave.body.project;
});
test('ordering requires admin and a complete permutation; logout invalidates session', async () => {
  const list = (await request('/api/projects', { auth: admin })).body.projects;
  const ids = list.map(p => p.id).reverse();
  assert.equal((await request('/api/projects/order', { method: 'PATCH', auth: owner, body: { ids } })).status, 403);
  assert.equal((await request('/api/projects/order', { method: 'PATCH', auth: admin, body: { ids: [ids[0], ids[0]] } })).status, 400);
  const ordered = await request('/api/projects/order', { method: 'PATCH', auth: admin, body: { ids } });
  assert.equal(ordered.status, 200); assert.deepEqual(ordered.body.projects.map(p => p.id), ids);
  assert.equal((await request('/api/auth/logout', { method: 'POST', auth: other, body: {} })).status, 200);
  assert.equal((await request('/api/projects', { auth: other })).status, 401);
});
test('login has bounded attempts', async () => {
  const results = [];
  for (let index = 0; index < 7; index++) results.push(await request('/api/auth/login', { method: 'POST', body: { username: 'Euphie', password: 'wrong' } }));
  assert.equal(results.at(-1).status, 429);
});

test('projects, credentials, sessions and immutable snapshots survive reopening SQLite', async () => {
  await app.close();
  app = await createApp({ dataDir: directory, allowedOrigins: [origin] });
  await new Promise((resolve, reject) => { app.server.once('error', reject); app.server.listen(0, '127.0.0.1', resolve); });
  base = `http://127.0.0.1:${app.server.address().port}`;
  assert.equal((await request('/api/auth/session', { auth: owner })).body.user.usingInitialPassword, false);
  assert.equal((await request(`/api/projects/${project.id}`, { auth: owner })).body.project.data.title, 'Private new draft');
  assert.equal((await request(`/api/public/projects/${project.id}`)).body.project.data.title, 'Reviewed title');
});

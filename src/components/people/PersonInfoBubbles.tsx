import { motion } from 'framer-motion'
import type { PersonRecord } from '../../data/people'
import { reveal } from '../../lib/animations'

type PersonInfoBubblesProps = {
  person: PersonRecord
}

export function PersonInfoBubbles(props: PersonInfoBubblesProps) {
  return (
    <>
      {props.person.emails.length > 0 || props.person.website ? (
        <motion.div variants={reveal} className="info-bubble info-bubble--contact">
          <span className="info-bubble__label">Email</span>
          <div className="info-bubble__contact-list">
            {props.person.emails.map((email) => (
              <a key={email} className="info-bubble__email" href={`mailto:${email}`}>
                {email}
              </a>
            ))}
          </div>

          {props.person.website ? (
            <a
              className="info-bubble__site-link"
              href={props.person.website}
              target="_blank"
              rel="noreferrer"
            >
              Visit personal site
            </a>
          ) : null}
        </motion.div>
      ) : null}

      <motion.div variants={reveal} className="info-bubble info-bubble--research">
        <span className="info-bubble__label">Research Interest</span>
        <p>{props.person.researchInterest}</p>
      </motion.div>

      <motion.div variants={reveal} className="info-bubble info-bubble--bio">
        <span className="info-bubble__label">Introduction</span>
        {props.person.bioParagraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </motion.div>
    </>
  )
}

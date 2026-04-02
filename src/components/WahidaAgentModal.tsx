import { useState } from 'react'
import { Drawer, Button, Tag, Avatar, Typography, Divider, Space, Tooltip } from 'antd'
import {
  GithubOutlined, LinkedinOutlined, DownloadOutlined,
  MailOutlined, TrophyOutlined, BookOutlined, CodeOutlined, StarFilled,
} from '@ant-design/icons'
import { motion } from 'framer-motion'

const { Title, Text, Paragraph } = Typography

interface WahidaAgentModalProps {
  open: boolean
  onClose: () => void
}

const skills = [
  'React', 'TypeScript', 'Node.js', 'Python', 'AI/ML', 'System Design',
  'UI/UX', 'REST APIs', 'Git', 'Agile',
]

const projects = [
  {
    name: 'AI Agent Builder',
    desc: 'A dynamic drag-and-drop tool to assemble AI agents with skills and personality layers.',
    tags: ['React', 'TypeScript', 'dnd-kit', 'Zustand'],
    color: '#6366f1',
  },
  {
    name: 'Panda Commerce',
    desc: 'Full-stack e-commerce platform with shopping cart, trust signals, and product management.',
    tags: ['React', 'Node.js', 'CSS'],
    color: '#10b981',
  },
  {
    name: 'Flower Shop',
    desc: 'A beautifully designed flower shop landing page with masonry layout and smooth animations.',
    tags: ['HTML', 'CSS', 'JavaScript'],
    color: '#f59e0b',
  },
]

function WahidaAgentModal({ open, onClose }: WahidaAgentModalProps) {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)

  return (
    <Drawer
      open={open}
      onClose={onClose}
      placement="right"
      width={480}
      title={null}
      closeIcon={null}
      styles={{
        body: { padding: 0, background: '#0a0f1e', overflowY: 'auto' },
        mask: { backdropFilter: 'blur(4px)' },
        wrapper: { boxShadow: '-8px 0 40px rgba(99,102,241,0.2)' },
      }}
    >
      {/* Hero header */}
      <div className="cv-hero">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }}>
          <Avatar
            size={90}
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              fontSize: 36,
              fontWeight: 800,
              border: '3px solid #6366f155',
              boxShadow: '0 0 30px #6366f155',
            }}
          >
            W
          </Avatar>
        </motion.div>
        <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
          <Title level={3} style={{ color: '#fff', margin: '12px 0 2px', fontWeight: 800 }}>
            Wahida Akhter
          </Title>
          <Text style={{ color: '#8b5cf6', fontWeight: 600, fontSize: 14 }}>
            Lead Architect · Full-Stack Developer
          </Text>
          <div style={{ marginTop: 8 }}>
            <Tag color="purple" icon={<BookOutlined />}>Master's Student</Tag>
            <Tag color="geekblue">Dhaka University</Tag>
          </div>
        </motion.div>
        <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
          <Space style={{ marginTop: 16 }}>
            <Tooltip title="GitHub">
              <Button shape="circle" icon={<GithubOutlined />} href="https://github.com/WahidaAkhter" target="_blank" className="cv-social-btn" />
            </Tooltip>
            <Tooltip title="LinkedIn">
              <Button shape="circle" icon={<LinkedinOutlined />} className="cv-social-btn" />
            </Tooltip>
            <Tooltip title="Email">
              <Button shape="circle" icon={<MailOutlined />} className="cv-social-btn" />
            </Tooltip>
          </Space>
        </motion.div>
      </div>

      <div className="cv-body">
        {/* About */}
        <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }}>
          <div className="cv-section">
            <div className="cv-section-title">
              <StarFilled style={{ color: '#6366f1', marginRight: 8 }} />
              About
            </div>
            <Paragraph style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.7, margin: 0 }}>
              A passionate full-stack developer and Master's student at the University of Dhaka, specializing in building 
              intelligent, performance-optimized web applications. Obsessed with creating beautiful, user-centric 
              experiences with modern React ecosystems and AI tooling.
            </Paragraph>
          </div>
        </motion.div>

        <Divider style={{ borderColor: '#1e293b', margin: '4px 0' }} />

        {/* Education */}
        <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
          <div className="cv-section">
            <div className="cv-section-title">
              <BookOutlined style={{ color: '#6366f1', marginRight: 8 }} />
              Education
            </div>
            <div className="cv-edu-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <Text style={{ color: '#e2e8f0', fontWeight: 600 }}>Master of Science</Text>
                  <br />
                  <Text style={{ color: '#8b5cf6', fontSize: 13 }}>University of Dhaka</Text>
                </div>
                <Tag color="purple">In Progress</Tag>
              </div>
            </div>
          </div>
        </motion.div>

        <Divider style={{ borderColor: '#1e293b', margin: '4px 0' }} />

        {/* Skills */}
        <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.45 }}>
          <div className="cv-section">
            <div className="cv-section-title">
              <CodeOutlined style={{ color: '#6366f1', marginRight: 8 }} />
              Technical Skills
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {skills.map(skill => (
                <motion.div
                  key={skill}
                  whileHover={{ scale: 1.08 }}
                  onHoverStart={() => setHoveredSkill(skill)}
                  onHoverEnd={() => setHoveredSkill(null)}
                >
                  <Tag
                    style={{
                      background: hoveredSkill === skill ? '#6366f133' : '#1e293b',
                      border: `1px solid ${hoveredSkill === skill ? '#6366f1' : '#334155'}`,
                      color: hoveredSkill === skill ? '#818cf8' : '#94a3b8',
                      borderRadius: 6,
                      cursor: 'default',
                      transition: 'all 0.2s',
                      padding: '4px 10px',
                    }}
                  >
                    {skill}
                  </Tag>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <Divider style={{ borderColor: '#1e293b', margin: '4px 0' }} />

        {/* Projects */}
        <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
          <div className="cv-section">
            <div className="cv-section-title">
              <TrophyOutlined style={{ color: '#6366f1', marginRight: 8 }} />
              Featured Projects
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {projects.map((proj, i) => (
                <motion.div
                  key={proj.name}
                  className="cv-project-card"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.08 }}
                  style={{ borderLeft: `3px solid ${proj.color}` }}
                >
                  <Text style={{ color: '#e2e8f0', fontWeight: 600 }}>{proj.name}</Text>
                  <Paragraph style={{ color: '#94a3b8', fontSize: 12, marginBottom: 8, marginTop: 2 }}>
                    {proj.desc}
                  </Paragraph>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {proj.tags.map(tag => (
                      <Tag key={tag} style={{ fontSize: 11, background: `${proj.color}22`, border: `1px solid ${proj.color}55`, color: proj.color }}>
                        {tag}
                      </Tag>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Download CTA */}
        <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
          <div style={{ padding: '16px 24px 32px' }}>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              size="large"
              block
              href="/wahida_akhter_cv.pdf"
              target="_blank"
              className="cv-download-btn"
            >
              Download Full CV (PDF)
            </Button>
          </div>
        </motion.div>
      </div>
    </Drawer>
  )
}

export default WahidaAgentModal

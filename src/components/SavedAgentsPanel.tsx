import { useState } from 'react'
import { Button, Typography, Tag, Tooltip, Empty, Popconfirm } from 'antd'
import { LoadingOutlined, DeleteOutlined, UserOutlined, ThunderboltOutlined, AppstoreOutlined, ApiOutlined, StarFilled, CheckCircleFilled } from '@ant-design/icons'
import { motion, AnimatePresence } from 'framer-motion'
import { useAgentStore } from '../store/agentStore'
import type { SavedAgent } from '../store/agentStore'
import WahidaAgentModal from './WahidaAgentModal'

const { Text } = Typography

const providerColorMap: Record<string, string> = {
  Gemini: '#4285F4',
  ChatGPT: '#10b981',
  Claude: '#f59e0b',
  DeepSeek: '#8b5cf6',
  Kimi: '#f43f5e',
}

function AgentCard({ agent, onLoad, onDelete }: { agent: SavedAgent, onLoad: () => void, onDelete: () => void }) {
  const isWahida = agent.id === 'wahida-lead-architect'
  const [showCV, setShowCV] = useState(false)

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
        className={`agent-card ${isWahida ? 'agent-card--wahida' : ''}`}
      >
        {/* Wahida avatar portrait */}
        {isWahida && (
          <div className="agent-card-avatar-wrap">
            <img
              src="/wahida_avatar.png"
              alt="Wahida avatar"
              className="agent-card-avatar"
            />
          </div>
        )}

        {isWahida && (
          <div className="agent-card-wahida-badge">
            <StarFilled style={{ color: '#f59e0b', fontSize: 10 }} /> Creator
            <CheckCircleFilled style={{ color: '#22c55e', fontSize: 10, marginLeft: 4 }} />
          </div>
        )}
        <Text className="agent-card-name">{agent.name}</Text>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, margin: '8px 0' }}>
          <Tag icon={<ThunderboltOutlined />} color="purple" style={{ fontSize: 11 }}>
            {agent.skillIds?.length || 0} Skills
          </Tag>
          <Tag icon={<AppstoreOutlined />} color="cyan" style={{ fontSize: 11 }}>
            {agent.layerIds?.length || 0} Layers
          </Tag>
          {agent.provider && (
            <Tag
              icon={<ApiOutlined />}
              style={{
                fontSize: 11,
                background: `${providerColorMap[agent.provider] || '#fff'}22`,
                border: `1px solid ${providerColorMap[agent.provider] || '#fff'}55`,
                color: providerColorMap[agent.provider] || '#fff',
              }}
            >
              {agent.provider}
            </Tag>
          )}
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 'auto' }}>
          {isWahida ? (
            <Button
              size="small"
              block
              className="agent-card-view-btn"
              icon={<UserOutlined />}
              onClick={() => setShowCV(true)}
            >
              View Profile
            </Button>
          ) : (
            <Button
              size="small"
              block
              className="agent-card-load-btn"
              icon={<LoadingOutlined />}
              onClick={onLoad}
            >
              Load
            </Button>
          )}
          {!isWahida && (
            <Tooltip title="Delete agent">
              <Popconfirm
                title="Delete this agent?"
                description="This action cannot be undone."
                onConfirm={onDelete}
                okText="Delete"
                cancelText="Cancel"
                okButtonProps={{ danger: true }}
              >
                <Button size="small" danger icon={<DeleteOutlined />} />
              </Popconfirm>
            </Tooltip>
          )}
        </div>
      </motion.div>
      <WahidaAgentModal open={showCV} onClose={() => setShowCV(false)} />
    </>
  )
}

function SavedAgentsPanel() {
  const savedAgents = useAgentStore(s => s.savedAgents)
  const loadAgent = useAgentStore(s => s.loadAgent)
  const deleteAgent = useAgentStore(s => s.deleteAgent)
  const clearAllAgents = useAgentStore(s => s.clearAllAgents)

  const userAgents = savedAgents.filter(a => a.id !== 'wahida-lead-architect')
  const wahidaAgent = savedAgents.find(a => a.id === 'wahida-lead-architect')

  return (
    <div className="saved-panel">
      <div className="saved-panel-header">
        <Text className="saved-panel-title">Saved Agents</Text>
        {userAgents.length > 0 && (
          <Popconfirm
            title="Clear all agents?"
            description="This will remove all your saved agents permanently."
            onConfirm={clearAllAgents}
            okText="Clear All"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Button size="small" danger>Clear All</Button>
          </Popconfirm>
        )}
      </div>
      <div className="saved-panel-grid">
        <AnimatePresence>
          {/* Always show wahida first */}
          {wahidaAgent && (
            <AgentCard
              key={wahidaAgent.id}
              agent={wahidaAgent}
              onLoad={() => loadAgent(wahidaAgent)}
              onDelete={() => {}}
            />
          )}
          {savedAgents.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ gridColumn: '1 / -1' }}
            >
              <Empty
                description={<Text style={{ color: '#71717a', fontSize: 13 }}>No saved agents yet. Build one and save it!</Text>}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </motion.div>
          )}
          {userAgents.map(agent => (
            <AgentCard
              key={agent.id}
              agent={agent}
              onLoad={() => loadAgent(agent)}
              onDelete={() => deleteAgent(agent.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default SavedAgentsPanel

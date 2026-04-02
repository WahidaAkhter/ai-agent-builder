import { useRef } from 'react'
import { Select, Input, Button, Typography, Divider } from 'antd'
import { SaveOutlined, DeleteOutlined, UserOutlined, ApiOutlined, DownloadOutlined, UploadOutlined } from '@ant-design/icons'
import { useAgentStore } from '../store/agentStore'
import { message } from 'antd'
import type { SavedAgent } from '../store/agentStore'

const { Text } = Typography

const POWER_LEVELS = ['Minimal', 'Basic', 'Capable', 'Advanced', 'Expert']
const POWER_COLORS = ['#475569', '#3b82f6', '#8b5cf6', '#6366f1', '#f59e0b']

function AgentPowerMeter({ skills, layers }: { skills: number; layers: number }) {
  const total = skills + layers
  const level = total === 0 ? 0 : total <= 2 ? 1 : total <= 5 ? 2 : total <= 9 ? 3 : total <= 13 ? 4 : 5
  const color = POWER_COLORS[Math.min(level, 4)]
  const label = POWER_LEVELS[Math.min(level, 4)]

  return (
    <div style={{ marginTop: 4 }}>
      <div style={{ display: 'flex', gap: 5, marginBottom: 6 }}>
        {[1, 2, 3, 4, 5].map(i => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 6,
              borderRadius: 99,
              background: i <= level ? color : '#1e293b',
              border: `1px solid ${i <= level ? color : '#334155'}`,
              transition: 'background 0.3s ease, border-color 0.3s ease',
              boxShadow: i <= level ? `0 0 6px ${color}88` : 'none',
            }}
          />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ color, fontSize: 11, fontWeight: 700 }}>{label}</Text>
        <Text style={{ color: '#475569', fontSize: 11 }}>{skills} skills · {layers} layers</Text>
      </div>
    </div>
  )
}

const PROVIDERS = ['Gemini', 'ChatGPT', 'Claude', 'DeepSeek', 'Kimi']

const providerColorMap: Record<string, string> = {
  Gemini: '#4285F4',
  ChatGPT: '#10b981',
  Claude: '#f59e0b',
  DeepSeek: '#8b5cf6',
  Kimi: '#f43f5e',
}

function AgentConfigPanel() {
  const data = useAgentStore(s => s.data)
  const selectedProfile = useAgentStore(s => s.selectedProfile)
  const selectedProvider = useAgentStore(s => s.selectedProvider)
  const agentName = useAgentStore(s => s.agentName)
  const selectedSkills = useAgentStore(s => s.selectedSkills)
  const selectedLayers = useAgentStore(s => s.selectedLayers)
  const setSelectedProfile = useAgentStore(s => s.setSelectedProfile)
  const setSelectedProvider = useAgentStore(s => s.setSelectedProvider)
  const setAgentName = useAgentStore(s => s.setAgentName)
  const loadAgent = useAgentStore(s => s.loadAgent)
  const saveAgent = useAgentStore(s => s.saveAgent)
  const resetCanvas = useAgentStore(s => s.resetCanvas)

  const importRef = useRef<HTMLInputElement>(null)

  const handleSave = () => {
    if (!agentName.trim()) {
      message.warning('Please enter an agent name before saving.')
      return
    }
    const success = saveAgent()
    if (success) {
      message.success(`Agent "${agentName}" saved successfully!`)
    }
  }

  const handleExport = () => {
    if (!selectedSkills.length && !selectedLayers.length && !selectedProfile) {
      message.warning('Nothing to export — configure your agent first.')
      return
    }
    const config = {
      name: agentName || 'My Agent',
      profileId: selectedProfile,
      skillIds: selectedSkills,
      layerIds: selectedLayers,
      provider: selectedProvider,
      exportedAt: new Date().toISOString(),
      version: '1.0',
    }
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${(agentName || 'agent').replace(/\s+/g, '_').toLowerCase()}_config.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    message.success('Agent config exported!')
  }

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const config = JSON.parse(ev.target?.result as string)
        if (typeof config !== 'object' || config === null) throw new Error()
        const agent: SavedAgent = {
          id: `imported-${Date.now()}`,
          name: config.name || 'Imported Agent',
          profileId: config.profileId || '',
          skillIds: Array.isArray(config.skillIds) ? config.skillIds : [],
          layerIds: Array.isArray(config.layerIds) ? config.layerIds : [],
          provider: config.provider || '',
        }
        loadAgent(agent)
        message.success(`Imported "${agent.name}" successfully!`)
      } catch {
        message.error('Invalid JSON config file')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const profileOptions = data?.agentProfiles.map(p => ({
    value: p.id,
    label: p.name,
  })) || []

  return (
    <div className="config-panel">
      <div className="config-panel-header">
        <Text className="config-panel-title">Agent Config</Text>
        <Text className="config-panel-subtitle">Configure your agent's identity</Text>
      </div>

      <div className="config-panel-body">
        {/* Name */}
        <div className="config-field">
          <Text className="config-label">Agent Name</Text>
          <Input
            placeholder="e.g. My Research Bot"
            value={agentName}
            onChange={e => setAgentName(e.target.value)}
            prefix={<UserOutlined style={{ color: '#64748b' }} />}
            className="config-input"
          />
        </div>

        {/* Base Profile */}
        <div className="config-field">
          <Text className="config-label">Base Profile</Text>
          <Select
            placeholder="Select a profile..."
            value={selectedProfile || undefined}
            onChange={setSelectedProfile}
            options={profileOptions}
            className="config-select"
            style={{ width: '100%' }}
            allowClear
          />
        </div>

        {/* AI Provider */}
        <div className="config-field">
          <Text className="config-label">AI Provider</Text>
          <Select
            placeholder="Select a provider..."
            value={selectedProvider || undefined}
            onChange={setSelectedProvider}
            className="config-select"
            style={{ width: '100%' }}
            allowClear
            optionRender={(option) => (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: providerColorMap[option.value as string] || '#fff',
                  display: 'inline-block',
                }} />
                {option.label}
              </span>
            )}
          >
            {PROVIDERS.map(p => (
              <Select.Option key={p} value={p}>
                {p}
              </Select.Option>
            ))}
          </Select>
        </div>

        <Divider style={{ borderColor: '#1e293b', margin: '8px 0' }} />

        {/* Configuration Summary — Power Meter */}
        <div className="config-field">
          <Text className="config-label">Agent Power</Text>
          <AgentPowerMeter skills={selectedSkills.length} layers={selectedLayers.length} />
        </div>

        <Divider style={{ borderColor: '#1e293b', margin: '8px 0' }} />

        {/* Actions */}
        <Button
          type="primary"
          icon={<SaveOutlined />}
          onClick={handleSave}
          block
          className="config-save-btn"
        >
          Save Agent
        </Button>
        <Button
          icon={<DeleteOutlined />}
          onClick={resetCanvas}
          block
          className="config-reset-btn"
          style={{ marginTop: 8 }}
        >
          Reset Canvas
        </Button>

        <Divider style={{ borderColor: '#1e293b', margin: '12px 0 8px' }} />

        {/* Export / Import */}
        <div style={{ display: 'flex', gap: 8 }}>
          <Button
            icon={<DownloadOutlined />}
            onClick={handleExport}
            className="config-reset-btn"
            style={{ flex: 1 }}
          >
            Export
          </Button>
          <Button
            icon={<UploadOutlined />}
            onClick={() => importRef.current?.click()}
            className="config-reset-btn"
            style={{ flex: 1 }}
          >
            Import
          </Button>
          <input
            ref={importRef}
            type="file"
            accept=".json,application/json"
            style={{ display: 'none' }}
            onChange={handleImportFile}
          />
        </div>

        {/* Provider badge */}
        {selectedProvider && (
          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <div className="provider-badge" style={{ borderColor: `${providerColorMap[selectedProvider]}66` }}>
              <ApiOutlined style={{ color: providerColorMap[selectedProvider], marginRight: 6 }} />
              <Text style={{ color: providerColorMap[selectedProvider], fontSize: 12 }}>Powered by {selectedProvider}</Text>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AgentConfigPanel

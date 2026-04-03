import { useState } from 'react'
import { Input, Typography, Badge } from 'antd'
import { SearchOutlined, ThunderboltOutlined, AppstoreOutlined } from '@ant-design/icons'
import DraggableItem from './DraggableItem'
import { useAgentStore } from '../store/agentStore'
import type { Skill, Layer } from '../store/agentStore'

const { Text } = Typography

function SectionHeader({ icon, label, count, color }: { icon: React.ReactNode; label: string; count: number; color: string }) {
  return (
    <div className="armory-section-header">
      <span style={{ color, display: 'flex', alignItems: 'center', gap: 6 }}>
        {icon}
        <Text strong style={{ color, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {label}
        </Text>
      </span>
      <Badge
        count={count}
        style={{ backgroundColor: `${color}33`, color, boxShadow: 'none', fontSize: 10, fontWeight: 700 }}
      />
    </div>
  )
}

function Sidebar() {
  const data = useAgentStore(s => s.data)
  const selectedSkills = useAgentStore(s => s.selectedSkills)
  const selectedLayers = useAgentStore(s => s.selectedLayers)
  const [search, setSearch] = useState('')

  if (!data) return null

  const q = search.toLowerCase()

  const filteredSkills: Skill[] = data.skills.filter(
    s => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)
  )
  const filteredLayers: Layer[] = data.layers.filter(
    l => l.name.toLowerCase().includes(q) || l.description.toLowerCase().includes(q) || l.type.toLowerCase().includes(q)
  )

  return (
    <div className="sidebar">
      {/* Header */}
      <div className="sidebar-header">
        <Text className="sidebar-title">⚔ The Armory</Text>
        <Text className="sidebar-subtitle">Drag modules onto the canvas</Text>
        <Input
          prefix={<SearchOutlined style={{ color: '#64748b' }} />}
          placeholder="Search modules..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="sidebar-search"
          allowClear
        />
      </div>

      {/* Scrollable module grid */}
      <div className="sidebar-scroll">

        {/* Skills section */}
        <div className="armory-section">
          <SectionHeader
            icon={<ThunderboltOutlined />}
            label="Skills"
            count={filteredSkills.length}
            color="#8b5cf6"
          />
          <div className="armory-grid">
            {filteredSkills.map(skill => (
              <div
                key={skill.id}
                style={{
                  opacity: selectedSkills.includes(skill.id) ? 0.35 : 1,
                  pointerEvents: selectedSkills.includes(skill.id) ? 'none' : 'auto',
                }}
              >
                <DraggableItem
                  id={skill.id}
                  name={skill.name}
                  description={skill.description}
                  badge={skill.category}
                  kind="skill"
                  searchQuery={search}
                />
              </div>
            ))}
            {filteredSkills.length === 0 && (
              <Text style={{ color: '#64748b', fontSize: 12, gridColumn: '1 / -1', padding: '8px 0' }}>
                No skills match your search.
              </Text>
            )}
          </div>
        </div>

        {/* Layers section */}
        <div className="armory-section">
          <SectionHeader
            icon={<AppstoreOutlined />}
            label="Personality Layers"
            count={filteredLayers.length}
            color="#06b6d4"
          />
          <div className="armory-grid">
            {filteredLayers.map(layer => (
              <div
                key={layer.id}
                style={{
                  opacity: selectedLayers.includes(layer.id) ? 0.35 : 1,
                  pointerEvents: selectedLayers.includes(layer.id) ? 'none' : 'auto',
                }}
              >
                <DraggableItem
                  id={layer.id}
                  name={layer.name}
                  description={layer.description}
                  badge={layer.type}
                  kind="layer"
                  searchQuery={search}
                />
              </div>
            ))}
            {filteredLayers.length === 0 && (
              <Text style={{ color: '#64748b', fontSize: 12, gridColumn: '1 / -1', padding: '8px 0' }}>
                No layers match your search.
              </Text>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

export default Sidebar

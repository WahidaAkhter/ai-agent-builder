import { useState } from 'react'
import { Input, Collapse, Typography, Badge } from 'antd'
import { SearchOutlined, ThunderboltOutlined, AppstoreOutlined } from '@ant-design/icons'
import DraggableItem from './DraggableItem'
import { useAgentStore } from '../store/agentStore'
import type { Skill, Layer } from '../store/agentStore'

const { Text } = Typography

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

  const items = [
    {
      key: 'skills',
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ThunderboltOutlined style={{ color: '#8b5cf6' }} />
          <Text strong style={{ color: '#e2e8f0' }}>Skills</Text>
          <Badge count={filteredSkills.length} style={{ backgroundColor: '#8b5cf633', color: '#8b5cf6', boxShadow: 'none', fontSize: 10 }} />
        </span>
      ),
      children: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filteredSkills.map(skill => (
            <div key={skill.id} style={{ opacity: selectedSkills.includes(skill.id) ? 0.4 : 1, pointerEvents: selectedSkills.includes(skill.id) ? 'none' : 'auto' }}>
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
          {filteredSkills.length === 0 && <Text style={{ color: '#64748b', fontSize: 12 }}>No skills match your search.</Text>}
        </div>
      ),
    },
    {
      key: 'layers',
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <AppstoreOutlined style={{ color: '#06b6d4' }} />
          <Text strong style={{ color: '#e2e8f0' }}>Personality Layers</Text>
          <Badge count={filteredLayers.length} style={{ backgroundColor: '#06b6d433', color: '#06b6d4', boxShadow: 'none', fontSize: 10 }} />
        </span>
      ),
      children: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filteredLayers.map(layer => (
            <div key={layer.id} style={{ opacity: selectedLayers.includes(layer.id) ? 0.4 : 1, pointerEvents: selectedLayers.includes(layer.id) ? 'none' : 'auto' }}>
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
          {filteredLayers.length === 0 && <Text style={{ color: '#64748b', fontSize: 12 }}>No layers match your search.</Text>}
        </div>
      ),
    },
  ]

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <Text className="sidebar-title">The Armory</Text>
        <Text className="sidebar-subtitle">Drag modules onto the canvas →</Text>
        <Input
          prefix={<SearchOutlined style={{ color: '#64748b' }} />}
          placeholder="Search modules..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="sidebar-search"
          allowClear
        />
      </div>
      <div className="sidebar-scroll">
        <Collapse
          defaultActiveKey={['skills', 'layers']}
          ghost
          items={items}
          className="sidebar-collapse"
        />
      </div>
    </div>
  )
}

export default Sidebar

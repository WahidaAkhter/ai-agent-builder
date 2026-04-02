import { useCallback } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { AnimatePresence, motion } from 'framer-motion'
import { Typography } from 'antd'
import { InboxOutlined, RobotOutlined } from '@ant-design/icons'
import ModuleCard from './ModuleCard'
import { useAgentStore } from '../store/agentStore'

const { Text } = Typography

function Canvas() {
  const data = useAgentStore(s => s.data)
  const selectedSkills = useAgentStore(s => s.selectedSkills)
  const selectedLayers = useAgentStore(s => s.selectedLayers)
  const selectedProfile = useAgentStore(s => s.selectedProfile)
  const removeSkill = useAgentStore(s => s.removeSkill)
  const removeLayer = useAgentStore(s => s.removeLayer)

  const { setNodeRef, isOver } = useDroppable({ id: 'canvas-drop-zone' })

  const handleRemoveSkill = useCallback((id: string) => removeSkill(id), [removeSkill])
  const handleRemoveLayer = useCallback((id: string) => removeLayer(id), [removeLayer])

  const isEmpty = selectedSkills.length === 0 && selectedLayers.length === 0
  const profileName = data?.agentProfiles.find(p => p.id === selectedProfile)?.name

  return (
    <div
      ref={setNodeRef}
      className={`canvas ${isOver ? 'canvas--over' : 'canvas--grid'}`}
    >
      {/* Drop zone hint overlay */}
      {isOver && (
        <motion.div
          className="canvas-drop-hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <InboxOutlined style={{ fontSize: 48, color: '#6366f1' }} />
          <Text style={{ color: '#6366f1', fontSize: 16, fontWeight: 600 }}>Drop to add module</Text>
        </motion.div>
      )}

      {/* Canvas header */}
      <div className="canvas-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <RobotOutlined style={{ color: '#6366f1', fontSize: 20 }} />
          <div>
            <Text className="canvas-title">
              {profileName ? profileName : 'Unnamed Agent'}
            </Text>
            <Text className="canvas-subtitle">
              {selectedSkills.length} skill{selectedSkills.length !== 1 ? 's' : ''} · {selectedLayers.length} layer{selectedLayers.length !== 1 ? 's' : ''}
              {(selectedSkills.length > 0 || selectedLayers.length > 0) && (
                <span style={{ color: '#6366f155', marginLeft: 8, fontSize: 10 }}>drag ⠿ to reorder</span>
              )}
            </Text>
          </div>
        </div>
        <div className="canvas-pulse" />
      </div>

      {/* Empty state */}
      {isEmpty && !isOver && (
        <motion.div
          className="canvas-empty"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="canvas-empty-glow">
            <div className="canvas-empty-icon">
              <InboxOutlined />
            </div>
          </div>
          <Text className="canvas-empty-title">Your canvas is empty</Text>
          <Text className="canvas-empty-sub">Drag skills and personality layers from the left panel to build your agent</Text>
          <div className="canvas-empty-arrow">
            <span className="canvas-empty-arrow-label">← The Armory</span>
          </div>
        </motion.div>
      )}

      {/* Module cards */}
      {!isEmpty && (
        <div className="canvas-modules">
          {selectedSkills.length > 0 && (
            <div className="canvas-section">
              <Text className="canvas-section-label">⚡ Skills</Text>
              <SortableContext items={selectedSkills} strategy={verticalListSortingStrategy}>
                <AnimatePresence>
                  {selectedSkills.map(skillId => {
                    const skill = data?.skills.find(s => s.id === skillId)
                    if (!skill) return null
                    return (
                      <ModuleCard
                        key={skill.id}
                        id={skill.id}
                        name={skill.name}
                        description={skill.description}
                        badge={skill.category}
                        kind="skill"
                        onRemove={handleRemoveSkill}
                      />
                    )
                  })}
                </AnimatePresence>
              </SortableContext>
            </div>
          )}
          {selectedLayers.length > 0 && (
            <div className="canvas-section">
              <Text className="canvas-section-label">🧠 Personality Layers</Text>
              <SortableContext items={selectedLayers} strategy={verticalListSortingStrategy}>
                <AnimatePresence>
                  {selectedLayers.map(layerId => {
                    const layer = data?.layers.find(l => l.id === layerId)
                    if (!layer) return null
                    return (
                      <ModuleCard
                        key={layer.id}
                        id={layer.id}
                        name={layer.name}
                        description={layer.description}
                        badge={layer.type}
                        kind="layer"
                        onRemove={handleRemoveLayer}
                      />
                    )
                  })}
                </AnimatePresence>
              </SortableContext>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Canvas

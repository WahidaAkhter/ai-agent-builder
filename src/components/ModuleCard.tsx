import { memo } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { motion } from 'framer-motion'
import { Tag, Button, Typography, Tooltip } from 'antd'
import { CloseOutlined, HolderOutlined } from '@ant-design/icons'
import { skillIconMap } from './DraggableItem'

const { Text } = Typography

const categoryColorMap: Record<string, string> = {
  information: '#3b82f6',
  action: '#8b5cf6',
  reasoning: '#06b6d4',
  personality: '#f59e0b',
  context: '#10b981',
  formatting: '#f43f5e',
}

interface ModuleCardProps {
  id: string
  name: string
  description: string
  badge: string
  kind: 'skill' | 'layer'
  onRemove: (id: string) => void
}

const ModuleCard = memo(({ id, name, description, badge, kind, onRemove }: ModuleCardProps) => {
  const accentColor = categoryColorMap[badge] || '#6366f1'

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const sortableStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 'auto' as const,
  }

  return (
    // Outer div carries the sortable ref + transform — kept separate from motion to avoid conflicts
    <div ref={setNodeRef} style={sortableStyle}>
      <motion.div
        layout
        initial={{ opacity: 0, x: -24, scale: 0.95 }}
        animate={{ opacity: isDragging ? 0.35 : 1, x: 0, scale: isDragging ? 1.02 : 1 }}
        exit={{ opacity: 0, scale: 0.8, x: 24 }}
        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
        className="module-card"
        style={{ borderLeft: `3px solid ${accentColor}` }}
      >
        {/* Drag handle */}
        <div
          className="module-card-handle"
          {...attributes}
          {...listeners}
          title="Drag to reorder"
        >
          <HolderOutlined />
        </div>

        <div className="module-card-icon" style={{ color: accentColor }}>
          {skillIconMap[id]}
        </div>
        <div className="module-card-body">
          <div className="module-card-header">
            <Text className="module-card-name">{name}</Text>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Tag
                style={{
                  fontSize: 10,
                  borderRadius: 4,
                  background: `${accentColor}22`,
                  border: `1px solid ${accentColor}66`,
                  color: accentColor,
                  margin: 0,
                }}
              >
                {kind}
              </Tag>
              <Tooltip title="Remove">
                <Button
                  type="text"
                  size="small"
                  icon={<CloseOutlined />}
                  onClick={() => onRemove(id)}
                  className="module-card-remove"
                />
              </Tooltip>
            </div>
          </div>
          <Text className="module-card-desc">{description}</Text>
        </div>
      </motion.div>
    </div>
  )
})

ModuleCard.displayName = 'ModuleCard'
export default ModuleCard

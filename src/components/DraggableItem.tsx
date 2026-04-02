import React, { memo } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { Tag, Typography } from 'antd'
import {
  SearchOutlined, CodeOutlined, DatabaseOutlined, MailOutlined,
  CalendarOutlined, FilePdfOutlined, PictureOutlined, BarChartOutlined,
  TranslationOutlined, GlobalOutlined, BranchesOutlined, ShareAltOutlined,
  BulbOutlined, SyncOutlined, CrownOutlined, SmileOutlined, HistoryOutlined,
  HeartOutlined, SafetyOutlined, CompressOutlined, TeamOutlined, ThunderboltOutlined,
  StarOutlined, FontColorsOutlined,
} from '@ant-design/icons'

const { Text } = Typography

export type DraggableKind = 'skill' | 'layer'

interface DraggableItemProps {
  id: string
  name: string
  description: string
  badge: string
  kind: DraggableKind
}

export const skillIconMap: Record<string, React.ReactNode> = {
  sk_search: <SearchOutlined />,
  sk_code: <CodeOutlined />,
  sk_db: <DatabaseOutlined />,
  sk_email: <MailOutlined />,
  sk_calendar: <CalendarOutlined />,
  sk_pdf_parse: <FilePdfOutlined />,
  sk_image_gen: <PictureOutlined />,
  sk_data_analysis: <BarChartOutlined />,
  sk_translate: <TranslationOutlined />,
  sk_web_scrape: <GlobalOutlined />,
  sk_git: <BranchesOutlined />,
  sk_social: <ShareAltOutlined />,
  ly_cot: <BulbOutlined />,
  ly_reflexion: <SyncOutlined />,
  ly_sarcasm: <CrownOutlined />,
  ly_pirate: <SmileOutlined />,
  ly_memory: <HistoryOutlined />,
  ly_empathetic: <HeartOutlined />,
  ly_fact_checker: <SafetyOutlined />,
  ly_concise: <CompressOutlined />,
  ly_multi_agent: <TeamOutlined />,
  ly_code_optimizer: <ThunderboltOutlined />,
  ly_shakespeare: <StarOutlined />,
  ly_markdown: <FontColorsOutlined />,
}

const categoryColorMap: Record<string, string> = {
  information: '#3b82f6',
  action: '#8b5cf6',
  reasoning: '#06b6d4',
  personality: '#f59e0b',
  context: '#10b981',
  formatting: '#f43f5e',
}

export type { DraggableItemProps }

function highlight(text: string, query: string) {
  if (!query.trim()) return <>{text}</>
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'))
  return <>{parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase()
      ? <mark key={i} className="search-highlight">{part}</mark>
      : part
  )}</>
}

const DraggableItem = memo(({ id, name, description, badge, kind, searchQuery = '' }: DraggableItemProps & { searchQuery?: string }) => {
  const { attributes, listeners, setNodeRef, isDragging, transform } = useDraggable({
    id,
    data: { id, name, description, badge, kind },
  })

  const style: React.CSSProperties = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0) scale(1.08) rotate(2.5deg)`
      : undefined,
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
    transition: isDragging ? 'none' : 'transform 0.18s ease, box-shadow 0.18s ease, opacity 0.18s ease',
    zIndex: isDragging ? 999 : 'auto',
    position: isDragging ? 'relative' : undefined,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="draggable-item"
    >
      <div className="draggable-item-icon">
        {skillIconMap[id]}
      </div>
      <div className="draggable-item-content">
        <Text className="draggable-item-name">{highlight(name, searchQuery)}</Text>
        <Text className="draggable-item-desc">{highlight(description, searchQuery)}</Text>
        <Tag
          style={{
            marginTop: 4,
            fontSize: 10,
            borderRadius: 4,
            background: `${categoryColorMap[badge] || '#555'}22`,
            border: `1px solid ${categoryColorMap[badge] || '#555'}66`,
            color: categoryColorMap[badge] || '#aaa',
          }}
        >
          {badge}
        </Tag>
      </div>
    </div>
  )
})

DraggableItem.displayName = 'DraggableItem'
export default DraggableItem

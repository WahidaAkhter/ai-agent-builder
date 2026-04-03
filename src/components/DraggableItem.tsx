import React, { memo } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { RightOutlined } from '@ant-design/icons'
import {
  SearchOutlined, CodeOutlined, DatabaseOutlined, MailOutlined,
  CalendarOutlined, FilePdfOutlined, PictureOutlined, BarChartOutlined,
  TranslationOutlined, GlobalOutlined, BranchesOutlined, ShareAltOutlined,
  BulbOutlined, SyncOutlined, CrownOutlined, SmileOutlined, HistoryOutlined,
  HeartOutlined, SafetyOutlined, CompressOutlined, TeamOutlined, ThunderboltOutlined,
  StarOutlined, FontColorsOutlined,
} from '@ant-design/icons'

export type DraggableKind = 'skill' | 'layer'

interface DraggableItemProps {
  id: string
  name: string
  description: string
  badge: string
  kind: DraggableKind
  searchQuery?: string
}

export const skillIconMap: Record<string, React.ReactNode> = {
  sk_search:       <SearchOutlined />,
  sk_code:         <CodeOutlined />,
  sk_db:           <DatabaseOutlined />,
  sk_email:        <MailOutlined />,
  sk_calendar:     <CalendarOutlined />,
  sk_pdf_parse:    <FilePdfOutlined />,
  sk_image_gen:    <PictureOutlined />,
  sk_data_analysis:<BarChartOutlined />,
  sk_translate:    <TranslationOutlined />,
  sk_web_scrape:   <GlobalOutlined />,
  sk_git:          <BranchesOutlined />,
  sk_social:       <ShareAltOutlined />,
  ly_cot:          <BulbOutlined />,
  ly_reflexion:    <SyncOutlined />,
  ly_sarcasm:      <CrownOutlined />,
  ly_pirate:       <SmileOutlined />,
  ly_memory:       <HistoryOutlined />,
  ly_empathetic:   <HeartOutlined />,
  ly_fact_checker: <SafetyOutlined />,
  ly_concise:      <CompressOutlined />,
  ly_multi_agent:  <TeamOutlined />,
  ly_code_optimizer:<ThunderboltOutlined />,
  ly_shakespeare:  <StarOutlined />,
  ly_markdown:     <FontColorsOutlined />,
}

// Tinted card background + icon color per category — mirrors NotebookLM palette
const categoryStyle: Record<string, { bg: string; iconColor: string; border: string }> = {
  information: { bg: 'rgba(59,130,246,0.12)', iconColor: '#60a5fa', border: 'rgba(59,130,246,0.25)' },
  action:      { bg: 'rgba(139,92,246,0.12)', iconColor: '#a78bfa', border: 'rgba(139,92,246,0.25)' },
  reasoning:   { bg: 'rgba(6,182,212,0.12)',  iconColor: '#22d3ee', border: 'rgba(6,182,212,0.25)'  },
  personality: { bg: 'rgba(245,158,11,0.12)', iconColor: '#fbbf24', border: 'rgba(245,158,11,0.25)' },
  context:     { bg: 'rgba(16,185,129,0.12)', iconColor: '#34d399', border: 'rgba(16,185,129,0.25)' },
  formatting:  { bg: 'rgba(244,63,94,0.12)',  iconColor: '#fb7185', border: 'rgba(244,63,94,0.25)'  },
}

// Which items get a BETA badge
const BETA_IDS = new Set(['ly_multi_agent', 'ly_code_optimizer', 'sk_image_gen'])

export type { DraggableItemProps }

const DraggableItem = memo(({ id, name, description, badge, kind, searchQuery = '' }: DraggableItemProps) => {
  const { attributes, listeners, setNodeRef, isDragging, transform } = useDraggable({
    id,
    data: { id, name, description, badge, kind },
  })

  const style: React.CSSProperties = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0) scale(1.06) rotate(1.5deg)`
      : undefined,
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
    transition: isDragging ? 'none' : 'transform 0.18s ease, opacity 0.18s ease',
    zIndex: isDragging ? 999 : 'auto',
    position: isDragging ? 'relative' : undefined,
  }

  const cat = categoryStyle[badge] ?? { bg: 'rgba(255,255,255,0.06)', iconColor: '#94a3b8', border: 'rgba(255,255,255,0.12)' }
  const isBeta = BETA_IDS.has(id)
  const icon = skillIconMap[id]

  // Highlight search matches in name
  function highlight(text: string) {
    if (!searchQuery.trim()) return <>{text}</>
    const parts = text.split(new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'))
    return <>{parts.map((part, i) =>
      part.toLowerCase() === searchQuery.toLowerCase()
        ? <mark key={i} className="search-highlight">{part}</mark>
        : part
    )}</>
  }

  const mergedStyle: React.CSSProperties = {
    ...style,
    background: cat.bg,
    borderColor: cat.border,
  }

  return (
    <div
      ref={setNodeRef}
      style={mergedStyle}
      {...listeners}
      {...attributes}
      className="armory-card"
      title={description}
    >
      {/* Icon row */}
      <div className="armory-card-top">
        <span className="armory-card-icon" style={{ color: cat.iconColor }}>
          {icon}
        </span>
        {isBeta && <span className="armory-card-beta">BETA</span>}
        <RightOutlined className="armory-card-chevron" />
      </div>

      {/* Name */}
      <span className="armory-card-name" style={{ color: cat.iconColor }}>
        {highlight(name)}
      </span>
    </div>
  )
})

DraggableItem.displayName = 'DraggableItem'
export default DraggableItem

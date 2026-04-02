import { useEffect, useRef, useState } from 'react'
import { ConfigProvider, theme, Layout, Button, Typography, Spin, Alert, Badge, Drawer } from 'antd'
import {
  DndContext, DragOverlay, PointerSensor, KeyboardSensor,
  useSensor, useSensors,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import { ReloadOutlined, RobotOutlined, GithubOutlined, MenuOutlined, SettingOutlined } from '@ant-design/icons'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from './components/Sidebar'
import Canvas from './components/Canvas'
import AgentConfigPanel from './components/AgentConfigPanel'
import SavedAgentsPanel from './components/SavedAgentsPanel'
import { useAgentStore } from './store/agentStore'
import type { AgentData } from './store/agentStore'
import DraggableItem from './components/DraggableItem'

const { Header, Sider, Content } = Layout
const { Text } = Typography

function App() {
  const setData = useAgentStore(s => s.setData)
  const setLoading = useAgentStore(s => s.setLoading)
  const setError = useAgentStore(s => s.setError)
  const loading = useAgentStore(s => s.loading)
  const error = useAgentStore(s => s.error)
  const data = useAgentStore(s => s.data)
  const addSkill = useAgentStore(s => s.addSkill)
  const addLayer = useAgentStore(s => s.addLayer)
  const reorderSkills = useAgentStore(s => s.reorderSkills)
  const reorderLayers = useAgentStore(s => s.reorderLayers)
  const selectedSkills = useAgentStore(s => s.selectedSkills)
  const selectedLayers = useAgentStore(s => s.selectedLayers)
  const initSavedAgents = useAgentStore(s => s.initSavedAgents)
  const savedAgents = useAgentStore(s => s.savedAgents)
  const agentName = useAgentStore(s => s.agentName)
  const agentNameRef = useRef(agentName)
  useEffect(() => { agentNameRef.current = agentName }, [agentName])

  // Mobile drawer state
  const [mobileArmoryOpen, setMobileArmoryOpen] = useState(false)
  const [mobileConfigOpen, setMobileConfigOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  const [activeDragData, setActiveDragData] = useState<{
    id: string; name: string; description: string; badge: string; kind: 'skill' | 'layer'
  } | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const fetchAPI = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/data.json')
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      const jsonData: AgentData = await response.json()
      setData(jsonData)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch agent data'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAPI()
    initSavedAgents()
  }, [])

  // Analytics heartbeat (stale-closure-free via ref)
  useEffect(() => {
    const interval = setInterval(() => {
      console.log(`[Analytics] Working on: "${agentNameRef.current || 'unnamed draft'}"`)
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragData(event.active.data.current as typeof activeDragData)
  }

  const onDragEnd = (event: DragEndEvent) => {
    const { over, active } = event

    if (!over) {
      setActiveDragData(null)
      return
    }

    // Determine if this is a canvas-to-canvas reorder (useSortable sets sortable data)
    const isReorder = !!active.data.current?.sortable
    const activeId = active.id as string
    const overId = over.id as string

    if (isReorder) {
      // Reorder within skills list
      if (selectedSkills.includes(activeId) && selectedSkills.includes(overId)) {
        const oldIndex = selectedSkills.indexOf(activeId)
        const newIndex = selectedSkills.indexOf(overId)
        if (oldIndex !== newIndex) reorderSkills(oldIndex, newIndex)
      }
      // Reorder within layers list
      else if (selectedLayers.includes(activeId) && selectedLayers.includes(overId)) {
        const oldIndex = selectedLayers.indexOf(activeId)
        const newIndex = selectedLayers.indexOf(overId)
        if (oldIndex !== newIndex) reorderLayers(oldIndex, newIndex)
      }
    } else {
      // Add from sidebar — accept drop on canvas zone OR on top of an existing module
      const { id, kind } = active.data.current as { id: string; kind: 'skill' | 'layer' }
      const isOverCanvas =
        overId === 'canvas-drop-zone' ||
        selectedSkills.includes(overId) ||
        selectedLayers.includes(overId)
      if (isOverCanvas) {
        if (kind === 'skill') addSkill(id)
        else if (kind === 'layer') addLayer(id)
      }
    }

    setActiveDragData(null)
  }

  const userAgentCount = savedAgents.filter(a => a.id !== 'wahida-lead-architect').length

  const armoryContent = loading && !data ? (
    <div className="sider-loading">
      <Spin size="large" />
      <Text style={{ color: '#64748b', marginTop: 12 }}>Loading modules...</Text>
    </div>
  ) : (
    <Sidebar />
  )

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#6366f1',
          colorBgBase: '#0a0f1e',
          colorBgContainer: '#0f172a',
          colorBgElevated: '#1e293b',
          colorBorder: '#1e293b',
          borderRadius: 10,
          fontFamily: "'Inter', system-ui, sans-serif",
        },
        components: {
          Select: { optionSelectedBg: '#6366f122' },
          Collapse: { headerBg: 'transparent', contentBg: 'transparent' },
          Drawer: { colorBgElevated: '#0a0f1e' },
        },
      }}
    >
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={onDragEnd}>
        <Layout style={{ minHeight: '100vh', background: '#0a0f1e' }}>

          {/* ── HEADER ── */}
          <Header className="app-header">
            <div className="app-header-left">
              {/* Mobile hamburger — Armory */}
              {isMobile && (
                <Button
                  icon={<MenuOutlined />}
                  onClick={() => setMobileArmoryOpen(true)}
                  className="mobile-icon-btn"
                />
              )}
              <div className="app-logo">
                <RobotOutlined />
              </div>
              <div>
                <Text className="app-header-title">AI Agent Builder</Text>
                {!isMobile && <Text className="app-header-sub">Design your custom AI personality</Text>}
              </div>
            </div>
            <div className="app-header-right">
              <AnimatePresence>
                {error && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                    <Alert message={error} type="error" showIcon closable style={{ padding: '2px 12px', fontSize: 12 }} />
                  </motion.div>
                )}
              </AnimatePresence>
              {!isMobile && (
                <Badge count={userAgentCount} color="#6366f1" offset={[-4, 4]}>
                  <Text style={{ color: '#64748b', fontSize: 13 }}>Saved Agents</Text>
                </Badge>
              )}
              <Button
                icon={<ReloadOutlined spin={loading} />}
                onClick={fetchAPI}
                loading={loading}
                className="reload-btn"
              >
                {!isMobile && (loading ? 'Loading...' : 'Reload Data')}
              </Button>
              <Button
                icon={<GithubOutlined />}
                href="https://github.com/WahidaAkhter/ai-agent-builder"
                target="_blank"
                className="github-btn"
              />
              {/* Mobile gear — Config */}
              {isMobile && (
                <Button
                  icon={<SettingOutlined />}
                  onClick={() => setMobileConfigOpen(true)}
                  className="mobile-icon-btn"
                />
              )}
            </div>
          </Header>

          {/* ── BODY ── */}
          <Layout style={{ background: 'transparent' }}>

            {/* Left Sidebar — desktop only */}
            {!isMobile && (
              <Sider width={300} className="app-sider" style={{ background: 'transparent' }}>
                {armoryContent}
              </Sider>
            )}

            {/* Center — Canvas */}
            <Content className="app-content">
              <Canvas />
              <SavedAgentsPanel />
            </Content>

            {/* Right Sidebar — desktop only */}
            {!isMobile && (
              <Sider width={280} className="app-sider app-sider--right" style={{ background: 'transparent' }}>
                <AgentConfigPanel />
              </Sider>
            )}
          </Layout>
        </Layout>

        {/* ── MOBILE DRAWERS ── */}
        <Drawer
          title={<Text style={{ color: '#e2e8f0', fontWeight: 700 }}>⚔ The Armory</Text>}
          placement="left"
          open={mobileArmoryOpen}
          onClose={() => setMobileArmoryOpen(false)}
          width={300}
          styles={{ body: { padding: 0, background: '#0f172a' }, header: { background: '#0f172a', borderBottom: '1px solid #1e293b' } }}
        >
          {armoryContent}
        </Drawer>

        <Drawer
          title={<Text style={{ color: '#e2e8f0', fontWeight: 700 }}>⚙ Agent Config</Text>}
          placement="right"
          open={mobileConfigOpen}
          onClose={() => setMobileConfigOpen(false)}
          width={300}
          styles={{ body: { padding: 0, background: '#0f172a' }, header: { background: '#0f172a', borderBottom: '1px solid #1e293b' } }}
        >
          <AgentConfigPanel />
        </Drawer>

        {/* DragOverlay — ghost while dragging from sidebar */}
        <DragOverlay>
          {activeDragData && !activeDragData.id.startsWith('sortable') ? (
            <div style={{ opacity: 0.92, pointerEvents: 'none' }}>
              <DraggableItem
                id={activeDragData.id}
                name={activeDragData.name}
                description={activeDragData.description}
                badge={activeDragData.badge}
                kind={activeDragData.kind}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </ConfigProvider>
  )
}

export default App

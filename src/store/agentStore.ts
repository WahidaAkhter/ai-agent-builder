import { create } from 'zustand'

export interface AgentProfile {
  id: string
  name: string
  description: string
}

export interface Skill {
  id: string
  name: string
  category: string
  description: string
}

export interface Layer {
  id: string
  name: string
  type: string
  description: string
}

export interface AgentData {
  agentProfiles: AgentProfile[]
  skills: Skill[]
  layers: Layer[]
}

export interface SavedAgent {
  id: string
  name: string
  profileId: string
  skillIds: string[]
  layerIds: string[]
  provider: string
}

interface AgentStore {
  // Data from API
  data: AgentData | null
  loading: boolean
  error: string | null
  setData: (data: AgentData) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void

  // Canvas configuration
  selectedProfile: string
  selectedSkills: string[]
  selectedLayers: string[]
  selectedProvider: string
  agentName: string

  setSelectedProfile: (id: string) => void
  addSkill: (id: string) => void
  removeSkill: (id: string) => void
  reorderSkills: (oldIndex: number, newIndex: number) => void
  addLayer: (id: string) => void
  removeLayer: (id: string) => void
  reorderLayers: (oldIndex: number, newIndex: number) => void
  setSelectedProvider: (provider: string) => void
  setAgentName: (name: string) => void
  resetCanvas: () => void

  // Saved agents
  savedAgents: SavedAgent[]
  saveAgent: () => boolean
  loadAgent: (agent: SavedAgent) => void
  deleteAgent: (id: string) => void
  clearAllAgents: () => void
  initSavedAgents: () => void
}

const WAHIDA_AGENT: SavedAgent = {
  id: 'wahida-lead-architect',
  name: 'Wahida — Lead Architect',
  profileId: 'profile_2',
  skillIds: ['sk_code', 'sk_search', 'sk_data_analysis', 'sk_git'],
  layerIds: ['ly_cot', 'ly_fact_checker', 'ly_concise'],
  provider: 'Gemini',
}

const persistAgents = (agents: SavedAgent[]) => {
  const userAgents = agents.filter(a => a.id !== 'wahida-lead-architect')
  localStorage.setItem('savedAgents', JSON.stringify(userAgents))
}

export const useAgentStore = create<AgentStore>((set, get) => ({
  data: null,
  loading: false,
  error: null,
  setData: (data) => set({ data }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  selectedProfile: '',
  selectedSkills: [],
  selectedLayers: [],
  selectedProvider: '',
  agentName: '',

  setSelectedProfile: (id) => set({ selectedProfile: id }),
  addSkill: (id) => {
    const { selectedSkills } = get()
    if (!selectedSkills.includes(id)) {
      set({ selectedSkills: [...selectedSkills, id] })
    }
  },
  removeSkill: (id) => set((state) => ({ selectedSkills: state.selectedSkills.filter(s => s !== id) })),
  reorderSkills: (oldIndex, newIndex) => {
    const arr = [...get().selectedSkills]
    arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0])
    set({ selectedSkills: arr })
  },
  addLayer: (id) => {
    const { selectedLayers } = get()
    if (!selectedLayers.includes(id)) {
      set({ selectedLayers: [...selectedLayers, id] })
    }
  },
  removeLayer: (id) => set((state) => ({ selectedLayers: state.selectedLayers.filter(l => l !== id) })),
  reorderLayers: (oldIndex, newIndex) => {
    const arr = [...get().selectedLayers]
    arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0])
    set({ selectedLayers: arr })
  },
  setSelectedProvider: (provider) => set({ selectedProvider: provider }),
  setAgentName: (name) => set({ agentName: name }),
  resetCanvas: () => set({
    selectedProfile: '',
    selectedSkills: [],
    selectedLayers: [],
    selectedProvider: '',
    agentName: '',
  }),

  savedAgents: [WAHIDA_AGENT],
  saveAgent: () => {
    const { agentName, selectedProfile, selectedSkills, selectedLayers, selectedProvider, savedAgents } = get()
    if (!agentName.trim()) return false
    const newAgent: SavedAgent = {
      id: `agent-${Date.now()}`,
      name: agentName.trim(),
      profileId: selectedProfile,
      skillIds: selectedSkills,
      layerIds: selectedLayers,
      provider: selectedProvider,
    }
    const updated = [...savedAgents, newAgent]
    set({ savedAgents: updated, agentName: '' })
    persistAgents(updated)
    return true
  },
  loadAgent: (agent) => {
    set({
      selectedProfile: agent.profileId || '',
      selectedSkills: agent.skillIds || [],
      selectedLayers: agent.layerIds || [],
      selectedProvider: agent.provider || '',
      agentName: agent.name,
    })
  },
  deleteAgent: (id) => {
    if (id === 'wahida-lead-architect') return
    const updated = get().savedAgents.filter(a => a.id !== id)
    set({ savedAgents: updated })
    persistAgents(updated)
  },
  clearAllAgents: () => {
    const updated = [WAHIDA_AGENT]
    set({ savedAgents: updated })
    localStorage.removeItem('savedAgents')
  },
  initSavedAgents: () => {
    try {
      const stored = localStorage.getItem('savedAgents')
      if (stored) {
        const parsed: SavedAgent[] = JSON.parse(stored)
        set({ savedAgents: [WAHIDA_AGENT, ...parsed] })
      }
    } catch {
      // silently fail
    }
  },
}))

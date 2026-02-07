import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Save an anonymous assessment response
export async function saveResponse({ language, answers, totalScore, maxScore, categoryScores }) {
  if (!supabase) {
    console.warn('Supabase not configured — skipping save')
    return null
  }

  const { data, error } = await supabase
    .from('assessment_responses')
    .insert([{
      language,
      answers,
      total_score: totalScore,
      max_score: maxScore,
      score_pct: totalScore / maxScore,
      category_scores: categoryScores,
      created_at: new Date().toISOString(),
    }])
    .select()

  if (error) {
    console.error('Error saving response:', error)
    return null
  }
  return data
}

// Fetch total response count (for welcome screen)
export async function fetchResponseCount() {
  if (!supabase) return 0

  const { count, error } = await supabase
    .from('assessment_responses')
    .select('*', { count: 'exact', head: true })

  if (error) {
    console.error('Error fetching count:', error)
    return 0
  }
  return count || 0
}

// Fetch all responses for dashboard
export async function fetchAllResponses() {
  if (!supabase) return []

  const { data, error } = await supabase
    .from('assessment_responses')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching responses:', error)
    return []
  }
  return data || []
}

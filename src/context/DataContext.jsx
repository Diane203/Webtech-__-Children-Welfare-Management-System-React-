import { createContext, useContext, useState, useEffect } from 'react'
import { loadDB, saveDB, generateId } from '../data/database'

const DataContext = createContext(null)
const today = () => new Date().toISOString().split('T')[0]

export function DataProvider({ children }) {
  const [db, setDb] = useState(loadDB)

  useEffect(() => { saveDB(db) }, [db])

  // generic helpers
  const add = (key, prefix, item) =>
    setDb((p) => ({ ...p, [key]: [...p[key], { ...item, id: generateId(prefix, p[key]) }] }))
  const remove = (key, id) =>
    setDb((p) => ({ ...p, [key]: p[key].filter((x) => x.id !== id) }))

  // users
  const addUser = (user) => setDb((p) => ({ ...p, users: [...p.users, user] }))
  const updateUser = (u) => setDb((p) => ({ ...p, users: p.users.map((x) => (x.id === u.id ? u : x)) }))

  // children
  const addChild = (c) =>
    add('children', 'CH', {
      ...c,
      admissionDate: today(),
      status: 'ACTIVE',
      avatar: c.gender === 'Male' ? '👦' : '👧',
    })
  const deleteChild = (id) => remove('children', id)

  // simple collections
  const addDonation = (d) => add('donations', 'DN', d)
  const deleteDonation = (id) => remove('donations', id)
  const addHealthRecord = (h) => add('healthRecords', 'HR', h)
  const addEducationRecord = (e) => add('education', 'ED', e)
  const addStaff = (s) => add('staff', 'ST', s)
  const deleteStaff = (id) => remove('staff', id)
  const addSponsor = (s) => add('sponsors', 'SP', s)
  const deleteSponsor = (id) => remove('sponsors', id)
  const createSponsorship = ({ donorName, donorEmail, donorPhone, amount, method, childId }) => {
    if (!donorName?.trim() || !donorEmail?.trim() || !donorPhone?.trim()) {
      throw new Error('Sponsor name, email, and phone are required.')
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error('Sponsorship amount must be a positive number.')
    }

    const child = db.children.find((c) => c.id === childId)
    if (!child || (child.sponsor && child.sponsor !== 'Unsponsored')) {
      throw new Error('This child is unavailable for sponsorship.')
    }

    const email = donorEmail.trim().toLowerCase()
    const existingSponsor = db.sponsors.find((s) => s.email?.trim().toLowerCase() === email)
    const sponsorName = existingSponsor?.name || donorName

    setDb((p) => {
      const currentChild = p.children.find((c) => c.id === childId)
      if (!currentChild || (currentChild.sponsor && currentChild.sponsor !== 'Unsponsored')) return p

      const currentSponsor = p.sponsors.find((s) => s.email?.trim().toLowerCase() === email)
      const sponsors = currentSponsor
        ? p.sponsors.map((s) =>
            s.id === currentSponsor.id
              ? {
                  ...s,
                  childrenSponsored: (Number(s.childrenSponsored) || 0) + 1,
                  totalDonated: (Number(s.totalDonated) || 0) + amount,
                }
              : s
          )
        : [
            ...p.sponsors,
            {
              id: generateId('SP', p.sponsors),
              name: sponsorName,
              email: donorEmail.trim(),
              phone: donorPhone,
              childrenSponsored: 1,
              totalDonated: amount,
              since: new Date().getFullYear().toString(),
              status: 'ACTIVE',
              preferences: { ageMin: null, ageMax: null, gender: 'Any', disabilityFocus: false },
            },
          ]

      return {
        ...p,
        children: p.children.map((c) => (c.id === childId ? { ...c, sponsor: sponsorName } : c)),
        sponsors,
        donations: [
          ...p.donations,
          {
            id: generateId('DN', p.donations),
            date: today(),
            donor: donorName,
            type: 'Cash',
            amount,
            purpose: `Child sponsorship - ${currentChild.name}`,
            method,
          },
        ],
      }
    })
  }
  const addAlert = (a) => add('alerts', 'AL', a)
  const addMilestone = (m) => add('milestones', 'MS', m)
  const addCaseNote = (n) => add('caseNotes', 'CN', n)

  const matchSponsor = (sponsorId, childId) =>
    setDb((p) => {
      const sp = p.sponsors.find((s) => s.id === sponsorId)
      const child = p.children.find((c) => c.id === childId)
      if (!sp || !child || (child.sponsor && child.sponsor !== 'Unsponsored')) return p
      return {
        ...p,
        children: p.children.map((c) => (c.id === childId ? { ...c, sponsor: sp.name } : c)),
        sponsors: p.sponsors.map((s) =>
          s.id === sponsorId
            ? { ...s, childrenSponsored: (Number(s.childrenSponsored) || 0) + 1 }
            : s
        ),
      }
    })

  return (
    <DataContext.Provider
      value={{
        db, addUser, updateUser,
        addChild, deleteChild,
        addDonation, deleteDonation,
        addHealthRecord, addEducationRecord,
        addStaff, deleteStaff,
        addSponsor, deleteSponsor, createSponsorship, matchSponsor,
        addAlert, addMilestone, addCaseNote,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => useContext(DataContext)
// apps/web/src/pages/Feed.tsx
import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

type TL = {
  id: string
  title: string
  description?: string
  category: { id: string; name: string }
  author: { id: string; name: string }
  items: { id: string; label: string; rank:
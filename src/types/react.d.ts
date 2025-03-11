import React from 'react'
import { NextPage } from 'next'
import { AppProps } from 'next/app'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any
    }
  }
} 
import React from 'react'

import { Link } from 'react-router-dom'

import { IconButton } from 'components/UIElements'

export const ExternalLink = ({
  link,
  children,
}: {
  link: string
  children: React.ReactChild
}) => (
  <a href={link} target="_blank" rel="noopener noreferrer">
    {children}
  </a>
)

export const ExternalButtonLink = ({
  link,
  children,
}: {
  link: string
  children: React.ReactChild
}) => (
  <a href={link} target="_blank" rel="noopener noreferrer">
    <IconButton>{children}</IconButton>
  </a>
)

export const ButtonLink = ({
  to,
  children,
}: {
  to: string
  children: React.ReactChild
}) => (
  <Link to={to}>
    <IconButton>{children}</IconButton>
  </Link>
)

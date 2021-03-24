import React from 'react'

import Icon, {
  TwitterOutlined,
  RedditOutlined,
  MediumOutlined,
  GithubOutlined,
} from '@ant-design/icons'
import { ExternalButtonLink, ButtonLink } from 'components'

import { TelegramIcon } from 'components/Icons'
import { Logo } from 'components/Logo'

import { StyledFooter, FooterContainer, FooterItem } from './Footer.style'

export const Footer: React.FC = (): JSX.Element => {
  return (
    <FooterContainer>
      <StyledFooter>
        <FooterItem>
          <a
            href="https://thorchain.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Logo type="thorchain" />
          </a>
        </FooterItem>
        <FooterItem>
          <div className="footer-links-bar">
            <ButtonLink to="/stats">STATS</ButtonLink>
            <ButtonLink to="/faqs">FAQS</ButtonLink>
          </div>
        </FooterItem>
        <FooterItem>
          <div className="footer-social-bar">
            <ExternalButtonLink link="https://twitter.com/thorchain_org">
              <TwitterOutlined />
            </ExternalButtonLink>
            <ExternalButtonLink link="https://reddit.com/r/thorchain">
              <RedditOutlined />
            </ExternalButtonLink>
            <ExternalButtonLink link="https://medium.com/thorchain">
              <MediumOutlined />
            </ExternalButtonLink>
            <ExternalButtonLink link="https://t.me/thorchain_org">
              <Icon component={TelegramIcon} />
            </ExternalButtonLink>
            <ExternalButtonLink link="https://github.com/thorchain">
              <GithubOutlined />
            </ExternalButtonLink>
          </div>
        </FooterItem>
      </StyledFooter>
    </FooterContainer>
  )
}

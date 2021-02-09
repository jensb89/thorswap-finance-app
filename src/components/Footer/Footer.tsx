import React from 'react'

import { Link } from 'react-router-dom'

import Icon, {
  TwitterOutlined,
  RedditOutlined,
  MediumOutlined,
  GithubOutlined,
  BranchesOutlined,
} from '@ant-design/icons'
import { TelegramIcon } from 'components/Icons'
import Logo from 'components/Logo'

import { StyledFooter, FooterContainer, FooterItem } from './Footer.style'

export type Props = {
  commitHash?: string
}

const Footer: React.FC<Props> = ({ commitHash }): JSX.Element => {
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
            <Link to="/tools">TOOLS</Link>
            <Link to="/explorer">EXPLORERS</Link>
            <Link to="/education">EDUCATION</Link>
            <Link to="/stats">STATS</Link>
            <Link to="/faqs">FAQS</Link>
          </div>
        </FooterItem>
        <FooterItem>
          <div className="footer-social-bar">
            <a
              href="https://twitter.com/thorchain_org"
              target="_blank"
              rel="noopener noreferrer"
            >
              <TwitterOutlined />
            </a>
            <a
              href="https://reddit.com/r/thorchain"
              target="_blank"
              rel="noopener noreferrer"
            >
              <RedditOutlined />
            </a>
            <a
              href="https://medium.com/thorchain"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MediumOutlined />
            </a>
            <a
              href="https://t.me/thorchain_org"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon component={TelegramIcon} />
            </a>
            <a
              href="https://github.com/thorchain"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GithubOutlined />
            </a>
            {commitHash && (
              <a
                href={`https://gitlab.com/thorchain/bepswap/bepswap-web-ui/-/commit/${commitHash}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <BranchesOutlined />
              </a>
            )}
          </div>
        </FooterItem>
      </StyledFooter>
    </FooterContainer>
  )
}

export default Footer

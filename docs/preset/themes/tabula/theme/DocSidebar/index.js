/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { useState } from 'react';
import clsx from 'clsx';
import {
  useThemeConfig,
  useAnnouncementBar,
  MobileSecondaryMenuFiller,
  ThemeClassNames,
  useScrollPosition,
} from '@docusaurus/theme-common';
import useWindowSize from '@theme/hooks/useWindowSize';
import Logo from '@theme/Logo';
import IconArrow from '@theme/IconArrow';
import { translate } from '@docusaurus/Translate';
import { DocSidebarItems } from '@theme/DocSidebarItem';
import styles from './styles.module.css';
import SidebarAbove from '../_tabula/SidebarAbove';
import SidebarBelow from '../_tabula/SidebarBelow';
// INJECTED-START: IMPORT

import useBaseUrl from '@docusaurus/useBaseUrl';

// INJECTED-END: IMPORT

function useShowAnnouncementBar() {
  const { isActive } = useAnnouncementBar();
  const [showAnnouncementBar, setShowAnnouncementBar] = useState(isActive);
  useScrollPosition(
    ({ scrollY }) => {
      if (isActive) {
        setShowAnnouncementBar(scrollY === 0);
      }
    },
    [isActive],
  );
  return isActive && showAnnouncementBar;
}

function HideableSidebarButton({ onClick }) {
  return (
    <button
      type="button"
      title={translate({
        id: 'theme.docs.sidebar.collapseButtonTitle',
        message: 'Collapse sidebar',
        description: 'The title attribute for collapse button of doc sidebar',
      })}
      aria-label={translate({
        id: 'theme.docs.sidebar.collapseButtonAriaLabel',
        message: 'Collapse sidebar',
        description: 'The title attribute for collapse button of doc sidebar',
      })}
      className={clsx('button button--secondary button--outline', styles.collapseSidebarButton)}
      onClick={onClick}
    >
      <IconArrow className={styles.collapseSidebarButtonIcon} />
    </button>
  );
}

function DocSidebarDesktop({ path, sidebar, onCollapse, isHidden }) {
  const showAnnouncementBar = useShowAnnouncementBar();
  const {
    navbar: { hideOnScroll },
    hideableSidebar,
  } = useThemeConfig();
  return (
    <div
      className={clsx(styles.sidebar, {
        [styles.sidebarWithHideableNavbar]: hideOnScroll,
        [styles.sidebarHidden]: isHidden,
      })}
    >
      {hideOnScroll && <Logo tabIndex={-1} className={styles.sidebarLogo} />}
      {/* INJECTED: STUFF BELOW SIDEBAR */} <SidebarAbove /> {/* INJECTED-END */}
      <nav
        className={clsx('menu thin-scrollbar', styles.menu, {
          [styles.menuWithAnnouncementBar]: showAnnouncementBar,
        })}
      >
        <ul className={clsx(ThemeClassNames.docs.docSidebarMenu, 'menu__list')}>
          <DocSidebarItems items={sidebar} activePath={path} level={1} />
        </ul>
      </nav>
      {hideableSidebar && <HideableSidebarButton onClick={onCollapse} />}
      {/* INJECTED: STUFF BELOW SIDEBAR */} <SidebarBelow /> {/* INJECTED-END */}
    </div>
  );
}

const DocSidebarMobileSecondaryMenu = ({ toggleSidebar, sidebar, path }) => {
  return (
    <ul className={clsx(ThemeClassNames.docs.docSidebarMenu, 'menu__list')}>
      <DocSidebarItems items={sidebar} activePath={path} onItemClick={() => toggleSidebar()} level={1} />
    </ul>
  );
};

function DocSidebarMobile(props) {
  return <MobileSecondaryMenuFiller component={DocSidebarMobileSecondaryMenu} props={props} />;
}

const DocSidebarDesktopMemo = React.memo(DocSidebarDesktop);
const DocSidebarMobileMemo = React.memo(DocSidebarMobile);
export default function DocSidebar(props) {
  const windowSize = useWindowSize(); // Desktop sidebar visible on hydration: need SSR rendering

  const shouldRenderSidebarDesktop = windowSize === 'desktop' || windowSize === 'ssr'; // Mobile sidebar not visible on hydration: can avoid SSR rendering

  const shouldRenderSidebarMobile = windowSize === 'mobile';
  {
    /* INJECTED-START - API DOC PAGES */
  }
  try {
    const cfg = useThemeConfig();
    const redocPages = cfg.customFields.customFields.specs;
    if (redocPages.length) {
      const newEntry = {
        collapsed: true,
        type: 'category',
        label: 'OpenAPI Spec',
        items: redocPages.map(({ title, config }) => ({
          type: 'link',
          label: title,
          href: useBaseUrl(config.routePath),
        })),
      };
      props = { ...props, sidebar: [...props.sidebar, newEntry] };
    }
  } catch (e) {}

  {
    /* INJECTED-END - API DOC PAGES */
  }
  return (
    <>
      {shouldRenderSidebarDesktop && <DocSidebarDesktopMemo {...props} />}
      {shouldRenderSidebarMobile && <DocSidebarMobileMemo {...props} />}
    </>
  );
}

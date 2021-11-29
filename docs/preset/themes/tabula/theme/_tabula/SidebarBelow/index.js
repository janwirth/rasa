import React, { useState } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import clsx from 'clsx';

import VersionDropdown from '@theme/_tabula/VersionDropdown';

export default function RasaSidebarAbove() {
  const {
    siteConfig,
    siteConfig: { themeConfig, customFields },
    siteMetadata,
  } = useDocusaurusContext();

  return (
    <div className="tabula-sidebar-below">
      <div className="tabula-sidebar__logotype">
        <div className="logotype__logo"></div>
        <h2 className="logotype__heading">{siteConfig.title} Documentation</h2>
      </div>
      <p className="tabula-sidebar__tagline">{siteConfig.tagline}</p>
    </div>
  );
}

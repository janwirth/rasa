import React, { useState } from 'react';
import clsx from 'clsx';
import { useThemeConfig, useAnnouncementBar, MobileSecondaryMenuFiller } from '@docusaurus/theme-common';
import SearchBar from '@theme/SearchBar';
import styles from './styles.module.css';
import VersionDropdown from '@theme/_tabula/VersionDropdown';

export default function RasaSidebarAbove() {
  return (
    <div className={styles.above}>
      <SearchBar />
      <VersionDropdown />
    </div>
  );
}

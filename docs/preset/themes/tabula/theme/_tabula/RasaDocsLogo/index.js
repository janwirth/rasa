import React from 'react';
import Link from '@docusaurus/Link';
import ThemedImage from '@theme/ThemedImage';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import RasaDocsLogoSvg from '../../../assets/rasa-docs-logo.svg';

export default function RasaDocsLogo({ ...propsRest }) {
  const {
    siteConfig: { title: siteTitle },
    isClient,
  } = useDocusaurusContext();
  // TODO: use ThemedImage or similar solution if supporting darkMode
  return (
    <Link to="/" {...propsRest} className="tabula-rasa-docs-logo">
      <RasaDocsLogoSvg />
    </Link>
  );
}

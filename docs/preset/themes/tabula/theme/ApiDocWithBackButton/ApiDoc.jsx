import React from 'react';
import Layout from '@theme/Layout';
import Redoc from '@theme/Redoc';
{
  /* INJECTED-START: IMPORTS */
}
import useBaseUrl from '@docusaurus/useBaseUrl';
import Translate from '@docusaurus/Translate';
import './styles.css';
{
  /* INJECTED-END: IMPORTS */
}

function ApiDoc({ layoutProps, spec: propSpec }) {
  {
    /* INJECTED-START: USE META INFO FROM SPEC */
  }
  const { title, description } = propSpec.content.info;
  {
    /* INJECTED-END: USE META INFO FROM SPEC */
  }
  const spec = propSpec.type === 'object' ? propSpec.content : undefined;
  const specUrl = propSpec.type === 'url' ? propSpec.content : undefined;
  return (
    <Layout {...layoutProps} title={title} description={description}>
      {/* INJECTED-START: BACK BUTTON */}
      <a href={useBaseUrl('/')} className="clean-btn navbar-sidebar__back redocusaurus-back-button">
        <Translate
          id="theme.navbar.mobileSidebarSecondaryMenu.backButtonLabel"
          description="The label of the back button to return to main menu, inside the mobile navbar sidebar secondary menu (notably used to display the docs sidebar)"
        >
          ← Back to all docs
        </Translate>
      </a>
      {/* INJECTED-END: BACK BUTTON */}
      <Redoc spec={spec} specUrl={specUrl || propSpec.specUrl} />
    </Layout>
  );
}
export default ApiDoc;

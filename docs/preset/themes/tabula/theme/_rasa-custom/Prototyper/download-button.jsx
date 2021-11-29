import React from 'react';

import RasaButton from '@theme/_tabula/RasaButton';
import PrototyperContext from './context';

const DownloadButton = (props) => {
  const prototyperContext = React.useContext(PrototyperContext);

  return (
    <RasaButton
      onClick={prototyperContext.downloadProject}
      disabled={prototyperContext.chatState !== 'ready'}
      {...props}
    >
      Download project
    </RasaButton>
  );
};

export default DownloadButton;

import React from 'react';
import { CEOOverviewPage } from './CEOOverviewPage.jsx';

/** CEO Command Center (/dashboard); thin wrapper for a stable route module name. */
export function ExecutiveOverviewer(props) {
  return <CEOOverviewPage {...props} />;
}

export default ExecutiveOverviewer;

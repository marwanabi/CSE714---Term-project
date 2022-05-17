import React from 'react';

export default React.lazy(async () => {
  return await import(/* webpackChunkName: "monaco-editor" */ '@monaco-editor/react');
});

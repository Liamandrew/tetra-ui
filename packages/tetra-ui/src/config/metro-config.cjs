'use strict';

const withTetraUI = (config) => {
  const { withNativeWind } = require('nativewind/metro');

  return withNativeWind(config, {
    input: '../../packages/tetra-ui/src/styles/globals.css',
  });
};

module.exports = { withTetraUI };

import React from 'react'

import CloudflareDeploy from './cloudflare-deploy'

const deployIcon = () => {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 64 64"
      version="1.1"
      data-sanity-icon="true"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid"
    >
      <g transform="matrix(0.9375,0,0,1,2.00001,-2)">
        <path
          style={{
            stroke: 'currentColor',
            strokeWidth: '4',
          }}
          d="M0.544,46L58.674,46L58.674,45.958L63.072,45.958C63.281,45.961 63.467,45.821 63.522,45.62C63.834,44.511 63.995,43.364 64,42.212C63.98,35.298 58.29,29.617 51.376,29.608L51.376,29.606L50.736,29.626C50.69,29.626 50.645,29.637 50.604,29.656L49.315,29.098C49.317,29.037 49.311,28.976 49.298,28.916C47.798,22.126 41.738,17.062 34.498,17.062C27.818,17.062 22.158,21.376 20.13,27.362C18.816,26.386 17.13,25.862 15.346,26.03C12.138,26.35 9.546,28.918 9.25,32.126C9.172,32.924 9.229,33.729 9.418,34.508C4.203,34.649 -0.008,38.983 0,44.2C0,44.668 0.04,45.14 0.094,45.606C0.134,45.832 0.32,46 0.544,46Z"
        />
      </g>
      <g transform="matrix(-1.1776e-16,0.615385,-0.928571,-1.65246e-16,43.7143,16.8462)">
        <path
          style={{
            stroke: 'currentColor',
            strokeWidth: '4',
          }}
          d="M20.563,13.45L20.563,18L10,11L20.563,4L20.563,8.55L36,8.55L36,13.45L20.563,13.45Z"
        />
      </g>
    </svg>
  )
}

export default {
  title: 'Deploy',
  name: 'cloudflare-pages-deploy',
  icon: deployIcon,
  component: CloudflareDeploy,
}

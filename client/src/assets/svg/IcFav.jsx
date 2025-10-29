const IcFav = ({ color = '#376AED' }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='52'
    height='59'
    viewBox='0 0 52 59' // 유지하여 내부 모양은 유지
    fill='none'
  >
    <g filter='url(#filter0_d_26_772)'>
      <path
        d='M22.3108 11.6219C20.3417 13.591 20.3417 16.7835 22.3108 18.7526L29.9481 26.3899L30.0006 26.3374L30.0532 26.39L37.6906 18.7526C39.6596 16.7835 39.6596 13.5911 37.6906 11.622C35.7215 9.65294 32.529 9.65294 30.56 11.622L30.3543 11.8277C30.159 12.023 29.8424 12.023 29.6472 11.8277L29.4414 11.6219C27.4723 9.65288 24.2798 9.65288 22.3108 11.6219Z'
        fill={color}
      />
    </g>
    <defs>
      <filter
        id='filter0_d_26_772'
        x='0.833984'
        y='0.145142'
        width='58.334'
        height='56.2449'
        filterUnits='userSpaceOnUse'
        colorInterpolationFilters='sRGB'
      >
        <feFlood floodOpacity='0' result='BackgroundImageFix' />
        <feColorMatrix
          in='SourceAlpha'
          type='matrix'
          values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
          result='hardAlpha'
        />
        <feOffset dy='10' />
        <feGaussianBlur stdDeviation='10' />
        <feComposite in2='hardAlpha' operator='out' />
        <feColorMatrix
          type='matrix'
          values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0'
        />
        <feBlend
          mode='normal'
          in2='BackgroundImageFix'
          result='effect1_dropShadow_26_772'
        />
        <feBlend
          mode='normal'
          in='SourceGraphic'
          in2='effect1_dropShadow_26_772'
          result='shape'
        />
      </filter>
    </defs>
  </svg>
);

export default IcFav;

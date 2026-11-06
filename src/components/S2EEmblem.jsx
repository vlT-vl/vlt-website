const S2EEmblem = ({ className = '' }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`s2e-emblem${className ? ` ${className}` : ''}`}
      viewBox="33.6 -1 48.6 102.64"
      aria-hidden="true"
    >
      <path className="em em-rt s2e-navy" style={{ '--d': '0s' }} d="M68.84,45.19h12.31C78.7,20.93,59.07,1.75,34.62,0v12.27c17.7,1.68,31.87,15.43,34.22,32.92" />
      <path className="em em-rb s2e-cyan" style={{ '--d': '0.06s' }} d="M68.82,55.57c-2.39,17.44-16.55,31.13-34.2,32.8v12.27c24.41-1.75,44.01-20.87,46.51-45.07h-12.31Z" />
      <path className="em em-ar s2e-cyan" style={{ '--d': '0.22s' }} d="M34.62,20.34v7.52c10.23,2.36,17.86,11.51,17.86,22.46s-7.63,20.11-17.86,22.46v7.52c14.33-2.46,25.24-14.94,25.24-29.98s-10.91-27.51-25.24-29.98" />
    </svg>
  )
}

export default S2EEmblem

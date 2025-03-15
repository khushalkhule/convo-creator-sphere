
import React from 'react';

export const CirclePattern: React.FC = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden opacity-30">
      <svg
        className="absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 stroke-blue-600/10 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)]"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="e813992c-7d03-4cc4-a2bd-151760b470a0"
            width={200}
            height={200}
            x="50%"
            y={-1}
            patternUnits="userSpaceOnUse"
          >
            <path d="M100 200V.5M.5 .5H200" fill="none" />
          </pattern>
        </defs>
        <svg x="50%" y={-1} className="overflow-visible fill-gray-100/20">
          <path
            d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
            strokeWidth={0}
          />
        </svg>
        <rect
          width="100%"
          height="100%"
          strokeWidth={0}
          fill="url(#e813992c-7d03-4cc4-a2bd-151760b470a0)"
        />
      </svg>
    </div>
  );
};

export const GridPattern: React.FC = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden opacity-20">
      <svg
        className="absolute inset-0 h-full w-full stroke-gray-500/20"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="grid-pattern"
            width={40}
            height={40}
            patternUnits="userSpaceOnUse"
          >
            <path d="M.5 40V.5H40" fill="none" />
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          strokeWidth={0}
          fill="url(#grid-pattern)"
        />
      </svg>
    </div>
  );
};

export const DotsPattern: React.FC = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden opacity-20">
      <svg
        className="absolute top-0 left-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="dots-pattern"
            width={20}
            height={20}
            patternUnits="userSpaceOnUse"
          >
            <circle cx={1} cy={1} r={1} fill="currentColor" />
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="url(#dots-pattern)"
        />
      </svg>
    </div>
  );
};

export const WavesPattern: React.FC = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <svg
        className="absolute bottom-0 left-0 h-[30%] w-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          fill="currentColor"
          fillOpacity="0.04"
          d="M0,128L48,117.3C96,107,192,85,288,96C384,107,480,149,576,165.3C672,181,768,171,864,144C960,117,1056,75,1152,69.3C1248,64,1344,96,1392,112L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        />
      </svg>
    </div>
  );
};

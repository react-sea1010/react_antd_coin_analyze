import React from 'react';
import './CustomTableHeader.css';

export const CustomTableHeader = ({title}) => {
  return (
    <span className="rt-custom-header-column">
      <div className="rt-custom-column-sorters">
        <span className="rt-custom-column-title">{title}</span>
        <span className="rt-custom-column-sorter">
          <div title="Sort" className="rt-custom-column-sorter-inner rt-custom-column-sorter-inner-full">
            <i aria-label="icon: caret-up" className="anticon anticon-caret-up rt-custom-column-sorter-up off">
              <svg viewBox="0 0 1024 1024" data-icon="caret-up" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false"><path d="M858.9 689L530.5 308.2c-9.4-10.9-27.5-10.9-37 0L165.1 689c-12.2 14.2-1.2 35 18.5 35h656.8c19.7 0 30.7-20.8 18.5-35z"></path>
              </svg>
            </i>
            <i aria-label="icon: caret-down" className="anticon anticon-caret-down rt-custom-column-sorter-down off">
              <svg viewBox="0 0 1024 1024" data-icon="caret-down" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false"><path d="M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z"></path>
              </svg>
            </i>
          </div>
        </span>
      </div>
    </span>
  )
};


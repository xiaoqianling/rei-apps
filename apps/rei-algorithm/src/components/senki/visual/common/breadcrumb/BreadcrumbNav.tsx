import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './BreadcrumbNav.module.scss'; // Import styles

// Helper to capitalize words (optional)
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// Mapping for specific path segments to display names (customize as needed)
const pathSegmentNames: { [key: string]: string } = {
  simulatedetail: '模拟详情',
  sort: '排序算法',
  bubble: '冒泡排序',
  merge: '归并排序',
  quick: '快速排序',
  selection: '选择排序',
  shell: '希尔排序',
  // Add other mappings if necessary
};

const BreadcrumbNav = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x); // Split and remove empty strings

  const breadcrumbs = pathnames.map((value, index) => {
    const to = `/${pathnames.slice(0, index + 1).join('/')}`;
    const label = pathSegmentNames[value] || capitalize(value); // Use mapping or capitalize
    const isLast = index === pathnames.length - 1;

    return {
      label,
      to,
      isLast,
    };
  });

  // Optionally add a "Home" or base link if needed
  const allBreadcrumbs = [
    { label: '首页', to: '/', isLast: pathnames.length === 0 }, // Example Home link
    ...breadcrumbs,
  ];


  return (
    <nav aria-label="breadcrumb" className={styles.breadcrumbNav}>
      <ol>
        {allBreadcrumbs.map((crumb, index) => (
          <li key={crumb.to}>
            {crumb.isLast ? (
              // Render last item as plain text (or link if preferred)
              <span>{crumb.label}</span>
            ) : (
              <Link to={crumb.to}>{crumb.label}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default BreadcrumbNav;

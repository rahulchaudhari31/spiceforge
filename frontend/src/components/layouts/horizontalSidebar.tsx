import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { SidebarData1 } from "../../core/json/sidebar_dataone";

// ================= ITEMS TO HIDE =================
const ITEMS_TO_HIDE = [
  // Dashboard
  "Admin Dashboard 2",
  // Super Admin
  "Subscriptions",
  "Domain",
  "Purchase Transaction",
  // Application - everything
  "Application",
  // Layouts - everything
  "Layouts",
  // Inventory
  "Expired Products",
  "Brands",
  "Units",
  "Variant Attributes",
  "Warranties",
  "Print Barcode",
  "Print QR Code",
  // Stock
  "Stock Adjustment",
  "Stock Transfer",
  // Sales
  "Sales Return",
  "Quotation",
  "POS",
  // Promo - everything
  "Promo",
  // Purchases - everything
  "Purchases",
  // Finance & Accounts - everything
  "Income",
  "Bank Accounts",
  "Money Transfer",
  "Balance Sheet",
  "Trial Balance",
  "Cash Flow",
  "Account Statement",
  // People
  "Billers",
  "Stores",
  // Reports
  "Invoice Report",
  "Expense Report",
  "Tax Report",
  "Profit & Loss",
  "Annual Report",
  // Content CMS
  "Content",
  // Settings - everything
  "Settings",
  // UI Interface - everything
  "UI Interface",
  // Help - everything
  "Help",
  // Pages
  "Blank page",
  "Pricing",
  "Comming Soon",
  "Under Maintenance",
  // HRM - everything
  "Employees",
  "Attendance",
  "Leave & Holidays",
  // User Management
  "Delete Account Request",
];

// ================= FILTER FUNCTION =================
const filterMenuItems = (items: any[]): any[] => {
  return items
    .filter((item) => {
      // Check if this specific item should be hidden
      if (ITEMS_TO_HIDE.includes(item.tittle)) {
        return false;
      }
      return true;
    })
    .map((item) => {
      // If this item has subRoutes, filter them too
      if (item.subRoutes && Array.isArray(item.subRoutes)) {
        return {
          ...item,
          subRoutes: filterMenuItems(item.subRoutes),
        };
      }
      return item;
    })
    .filter((item) => {
      // Remove items that have no subRoutes (if they had subRoutes and all were filtered out)
      if (item.hasSubRoute && item.subRoutes && item.subRoutes.length === 0) {
        return false;
      }
      return true;
    });
};

const HorizontalSidebar = () => {
  const [opendSubMenu, setOpendSubMenu] = useState<[string | null, string | null, string | null]>([
    null,
    null,
    null
  ]);

  const sidebarRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Filter the sidebar data
  const filteredSidebarData = filterMenuItems(SidebarData1);

  /* ================= TOGGLES ================= */

  const showMenu = (title: string) => {
    setOpendSubMenu(prev =>
      prev[0] === title ? [null, null, null] : [title, null, null]
    );
  };

  const showSubMenu = (title: string) => {
    setOpendSubMenu(prev =>
      prev[1] === title ? [prev[0], null, null] : [prev[0], title, null]
    );
  };

  const showInnerMenu = (title: string) => {
    setOpendSubMenu(prev =>
      prev[2] === title ? [prev[0], prev[1], null] : [prev[0], prev[1], title]
    );
  };

  /* ================= CLICK OUTSIDE ================= */

  const handleClickOutside = (event: MouseEvent) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
      setOpendSubMenu([null, null, null]);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= ACTIVE HELPERS ================= */

  const isActiveRoute = (route?: string) => {
    if (!route) return false;
    return location.pathname.split("/")[1] === route.split("/")[1];
  };

  const isActiveMenu = (menu: any): boolean => {
    return (
      isActiveRoute(menu.route) ||
      menu.subRoutes?.some((sub: any) => isActiveMenu(sub))
    );
  };

  /* ================= LINK RENDER ================= */

  const renderLink = (
    item: any,
    children: React.ReactNode,
    className = ""
  ) => {
    if (item.external) {
      return (
        <a
          href={item.route || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className={className}
        >
          {children}
        </a>
      );
    }

    return (
      <Link to={item.route || "#"} className={className}>
        {children}
      </Link>
    );
  };

  /* ================= RENDER ================= */

  return (
    <div className="sidebar sidebar-horizontal" id="horizontal-menu" ref={sidebarRef}>
      <div className="sidebar-menu" id="sidebar-menu-3">
        <div className="main-menu">
          <ul className="nav">
            {filteredSidebarData.map((main, mainIndex) => (
              <li className="submenu" key={mainIndex}>
                <a
                  className={opendSubMenu[0] === main.tittle || isActiveMenu(main) ? "active" : ""}
                  onClick={() => showMenu(main.tittle)}
                >
                  <i className={`ti ti-${main.icon} me-2`} />
                  <span>{main.tittle}</span>
                  <span className="menu-arrow" />
                </a>

                {/* ========== LEVEL 2 ========== */}
                <ul className={`submenus-two ${opendSubMenu[0] === main.tittle ? "d-block" : "d-none"}`}>
                  {main.subRoutes.map((menu: any, i: number) => (
                    <React.Fragment key={i}>
                      {!menu.hasSubRoute && (
                        <li>
                          {renderLink(
                            menu,
                            <span>{menu.tittle}</span>,
                            isActiveRoute(menu.route) ? "active" : ""
                          )}
                        </li>
                      )}

                      {menu.hasSubRoute && (
                        <li className="submenu">
                          <a
                            className={isActiveMenu(menu) ? "active" : ""}
                            onClick={() => showSubMenu(menu.tittle)}
                          >
                            <span>{menu.tittle}</span>
                            <span className="menu-arrow" />
                          </a>

                          {/* ========== LEVEL 3 ========== */}
                          <ul
                            className={`submenus-three ${
                              opendSubMenu[1] === menu.tittle ? "d-block" : "d-none"
                            }`}
                          >
                            {menu.subRoutes?.map((sub: any, j: number) => (
                              <React.Fragment key={j}>
                                {!sub.hasSubRoute && (
                                  <li>
                                    {renderLink(
                                      sub,
                                      <span>{sub.tittle}</span>,
                                      isActiveRoute(sub.route) ? "active" : ""
                                    )}
                                  </li>
                                )}

                                {sub.hasSubRoute && (
                                  <li className="submenu">
                                    <a
                                      className={isActiveMenu(sub) ? "active" : ""}
                                      onClick={() => showInnerMenu(sub.tittle)}
                                    >
                                      <span>{sub.tittle}</span>
                                      <span className="menu-arrow" />
                                    </a>

                                    {/* OPTIONAL LEVEL 4 */}
                                    <ul
                                      className={`submenus-three ${
                                        opendSubMenu[2] === sub.tittle
                                          ? "d-block"
                                          : "d-none"
                                      }`}
                                    >
                                      {sub.subRoutes?.map((deep: any, k: number) => (
                                        <li key={k}>
                                          {renderLink(
                                            deep,
                                            <span>{deep.tittle}</span>,
                                            isActiveRoute(deep.route) ? "active" : ""
                                          )}
                                        </li>
                                      ))}
                                    </ul>
                                  </li>
                                )}
                              </React.Fragment>
                            ))}
                          </ul>
                        </li>
                      )}
                    </React.Fragment>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HorizontalSidebar;
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { SidebarData } from "../../core/json/siderbar_data";
// import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { all_routes } from "../../routes/all_routes";
import {
  customer15,
  logo,
  logoSmall,
  logoWhite,
  logoSmallWhite,
} from "../../utils/imagepath";

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
  "Create Product",
  "Sub Category",
  
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
  
  // Reports - everything
  "Reports",
  "Sales Report",
  "Purchase Report",
  "Inventory Report",
  "Invoice Report",
  "Supplier Report",
  "Customer Report",
  "Product Report",
  "Expense Report",
  "Income Report",
  "Tax Report",
  "Profit & Loss",
  "Annual Report",
  
  // Content (CMS) - everything
  "Content (CMS)",
  
  // User Management
  "Delete Account Request",
  
  // Pages - Hide everything EXCEPT Profile
  "Authentication",
  "Error Pages",
  "Blank page",
  "Pricing",
  "Comming Soon",
  "Under Maintenance",
  "Blank Page",
  "Coming Soon",
  // "Profile" is NOT in the list, so it stays visible
  
  // Settings - everything
  "General Settings",
  "Website Settings",
  "App Settings",
  "System Settings",
  "Financial Settings",
  "Other Settings",
  
  // UI Interface - everything
  "UI Interface",
  
  // Help - everything
  "Help",
  
  // HRM - everything
  "HRM",
];

// ================= FILTER FUNCTION =================
const filterMenuItems = (items: any[]): any[] => {
  return items
    .filter((item) => {
      // Check if this specific item should be hidden
      if (ITEMS_TO_HIDE.includes(item.label)) {
        return false;
      }
      return true;
    })
    .map((item) => {
      // If this item has submenuItems, filter them too
      if (item.submenuItems && Array.isArray(item.submenuItems)) {
        return {
          ...item,
          submenuItems: filterMenuItems(item.submenuItems),
        };
      }
      return item;
    })
    .filter((item) => {
      // Remove items that have no submenuItems (if they had submenuItems and all were filtered out)
      if (item.submenuItems && item.submenuItems.length === 0) {
        return false;
      }
      return true;
    });
};

// Recursively check if any nested child is active
const hasActiveNestedChild = (menuItem: any, currentPath: string): boolean => {
  if (menuItem?.link === currentPath) {
    return true;
  }
  if (menuItem?.submenuItems) {
    return menuItem.submenuItems.some((child: any) =>
      hasActiveNestedChild(child, currentPath)
    );
  }
  return false;
};

const Sidebar = () => {
  const route = all_routes;
  const Location = useLocation();
  // const { t } = useTranslation();

  const [subOpen, setSubopen] = useState("");
  const [subsidebar, setSubsidebar] = useState("");
  // Track which active links have subdrop class manually toggled off (true = toggled off, false/undefined = show subdrop)
  const [activeLinksSubdropToggled, setActiveLinksSubdropToggled] = useState<
    Map<string, boolean>
  >(new Map());

  // Filter the sidebar data
  const filteredSidebarData = filterMenuItems(SidebarData);

  const toggleSidebar = (title: string) => {
    setSubopen((prev) => (prev === title ? "" : title));
  };

  const toggleSubsidebar = (subitem: string) => {
    setSubsidebar((prev) => (prev === subitem ? "" : subitem));
  };

  // Toggle subdrop for active links
  const toggleActiveLinkSubdrop = (linkPath: string) => {
    setActiveLinksSubdropToggled((prev) => {
      const newMap = new Map(prev);
      const isToggledOff = newMap.get(linkPath);
      // Toggle: if it was toggled off (true), set to false (show subdrop), otherwise set to true (hide subdrop)
      newMap.set(linkPath, !isToggledOff);
      return newMap;
    });
  };

  useEffect(() => {
    // Reset subdrop toggle state when route changes
    setActiveLinksSubdropToggled(new Map());

    filteredSidebarData.forEach((mainLabel: any) => {
      mainLabel.submenuItems.forEach((title: any) => {
        const hasActiveChild = title.submenuItems?.some((item: any) => {
          // Check if the item's link matches the current path
          if (item.link === Location.pathname) {
            return true;
          }
          // Check for nested children
          if (hasActiveNestedChild(item, Location.pathname)) {
            // If item has submenu and active child, open the subsidebar
            if (item.submenu && item.submenuItems) {
              setSubsidebar(item.label);
            }
            return true;
          }
          return false;
        });
        if (hasActiveChild) {
          setSubopen(title.label);
        }
      });
    });
  }, [Location.pathname]);

  const [toggle, SetToggle] = useState(false);
  const handlesidebar = () => {
    document.body.classList.toggle("mini-sidebar");
    SetToggle((current) => !current);
  };

  const { expandMenus } = useSelector(
    (state: any) => state.themeSetting.expandMenus
  );
  const dataLayout = useSelector((state: any) => state.themeSetting.dataLayout);

  const expandMenu = () => {
    document.body.classList.remove("expand-menu");
  };
  const expandMenuOpen = () => {
    document.body.classList.add("expand-menu");
  };

  return (
    <div>
      <div
        className={`sidebar ${toggle ? "" : "active"} ${
          expandMenus || dataLayout === "layout-hovered" ? "expand-menu" : ""
        }`}
        id="sidebar"
        onMouseLeave={expandMenu}
        onMouseOver={expandMenuOpen}
      >
        <>
          {/* Logo */}
          <div className="sidebar-logo active">
            <Link to={route.newdashboard} className="logo logo-normal">
              <img src={logo} alt="Img" />
            </Link>
            <Link to={route.newdashboard} className="logo logo-white">
              <img src={logoWhite} alt="Img" />
            </Link>
            <Link to={route.newdashboard} className="logo-small">
              <img src={logoSmall} alt="Img" />
            </Link>
            <Link to={route.newdashboard} className="logo-small-white">
              <img src={logoSmallWhite} alt="Img" />
            </Link>
            <Link id="toggle_btn" to="#" onClick={handlesidebar}>
              <i className="feather icon-chevrons-left feather-16" />
            </Link>
          </div>
          {/* /Logo */}
          <div className="modern-profile p-3 pb-0">
            <div className="text-center rounded bg-light p-3 mb-4 border">
              <div className="avatar avatar-lg online mb-3">
                <img
                  src={customer15}
                  alt="Img"
                  className="img-fluid rounded-circle"
                />
              </div>
              <h6 className="fs-14 fw-bold mb-1">Adrian Herman</h6>
              <p className="fs-12 mb-0">System Admin</p>
            </div>
            <div className="sidebar-nav mb-3">
              <ul
                className="nav nav-tabs nav-tabs-solid nav-tabs-rounded nav-justified bg-transparent"
                role="tablist"
              >
                <li className="nav-item">
                  <Link className="nav-link active border-0" to="#">
                    Menu
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link border-0" to={route.chat}>
                    Chats
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link border-0" to={route.email}>
                    Inbox
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="sidebar-header p-3 pb-0 pt-2">
            <div className="text-center rounded bg-light p-2 mb-4 sidebar-profile d-flex align-items-center">
              <div className="avatar avatar-md onlin">
                <img
                  src={customer15}
                  alt="Img"
                  className="img-fluid rounded-circle"
                />
              </div>
              <div className="text-start sidebar-profile-info ms-2">
                <h6 className="fs-14 fw-bold mb-1">Adrian Herman</h6>
                <p className="fs-12">System Admin</p>
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-between menu-item mb-3">
              <div>
                <Link
                  to={route.newdashboard}
                  className="btn btn-sm btn-icon bg-light"
                >
                  <i className="ti ti-layout-grid-remove" />
                </Link>
              </div>
              <div>
                <Link to={route.chat} className="btn btn-sm btn-icon bg-light">
                  <i className="ti ti-brand-hipchat" />
                </Link>
              </div>
              <div>
                <Link
                  to={route.email}
                  className="btn btn-sm btn-icon bg-light position-relative"
                >
                  <i className="ti ti-message" />
                </Link>
              </div>
              <div className="notification-item">
                <Link
                  to={route.activities}
                  className="btn btn-sm btn-icon bg-light position-relative"
                >
                  <i className="ti ti-bell" />
                  <span className="notification-status-dot" />
                </Link>
              </div>
              <div className="me-0">
                <Link
                  to={route.generalsettings}
                  className="btn btn-sm btn-icon bg-light"
                >
                  <i className="ti ti-settings" />
                </Link>
              </div>
            </div>
          </div>
        </>
        <div data-simplebar="">
          <div className="sidebar-inner ">
            <div id="sidebar-menu" className="sidebar-menu">
              <ul>
                {filteredSidebarData?.map((mainLabel: any, index: any) => (
                  <li className="submenu-open" key={index}>
                    <h6 className="submenu-hdr">{mainLabel?.label}</h6>
                    <ul>
                      {mainLabel?.submenuItems?.map((title: any, i: any) => {
                        // Build array of all nested links for active state checking
                        const link_array: string[] = [];
                        title?.submenuItems?.forEach((link: any) => {
                          link_array.push(link?.link);
                          if (link?.submenu && link?.submenuItems) {
                            link?.submenuItems?.forEach((item: any) => {
                              link_array.push(item?.link);
                            });
                          }
                        });
                        title.links = link_array;

                        const isTitleActive = title?.links?.includes(
                          Location.pathname
                        );
                        const isTitleOpen = subOpen === title?.label;
                        const hasNoSubmenu = !title?.submenu;
                        const isDirectActive =
                          hasNoSubmenu && Location.pathname === title?.link;

                        return (
                          <React.Fragment key={i}>
                            <li
                              className={`submenu ${
                                isDirectActive
                                  ? "custom-active-hassubroute-false"
                                  : ""
                              }`}
                            >
                              <Link
                                to={title?.link || "#"}
                                onClick={(e) => {
                                  if (title?.submenu && !title?.link) {
                                    e.preventDefault();
                                  }
                                  toggleSidebar(title?.label);
                                }}
                                className={`${
                                  isTitleOpen || isTitleActive ? "subdrop" : ""
                                } ${isTitleActive ? "active" : ""}`}
                              >
                                <i className={`ti ti-${title.icon} me-2`}></i>
                                <span className="custom-active-span">
                                  {title?.label}
                                  {/* {t()} */}
                                </span>
                                {title?.submenu && (
                                  <span className="menu-arrow" />
                                )}
                              </Link>
                              <ul
                                style={{
                                  display:
                                    isTitleOpen || isTitleActive
                                      ? "block"
                                      : "none",
                                }}
                              >
                                {title?.submenuItems?.map(
                                  (item: any, titleIndex: any) => {
                                    const isItemActive = hasActiveNestedChild(
                                      item,
                                      Location.pathname
                                    );
                                    const isExternal = item?.external === true;

                                    const isSubdropToggledOff =
                                      activeLinksSubdropToggled.get(
                                        item?.link
                                      ) === true;

                                    const shouldShowSubdrop = isItemActive
                                      ? !isSubdropToggledOff
                                      : subsidebar === item?.label;

                                    return (
                                      <li
                                        className="submenu submenu-two"
                                        key={titleIndex}
                                      >
                                        {isExternal ? (
                                          <a
                                            href={item?.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`${
                                              isItemActive ? "active" : ""
                                            } ${
                                              shouldShowSubdrop ? "subdrop" : ""
                                            }`}
                                          >
                                            {item?.label}
                                          </a>
                                        ) : (
                                          <Link
                                            to={item?.link}
                                            className={`${
                                              isItemActive ? "active" : ""
                                            } ${
                                              shouldShowSubdrop ? "subdrop" : ""
                                            }`}
                                            onClick={(e) => {
                                              if (isItemActive) {
                                                e.preventDefault();
                                                toggleActiveLinkSubdrop(
                                                  item?.link
                                                );
                                                if (item?.submenu) {
                                                  toggleSubsidebar(item?.label);
                                                }
                                              } else if (item?.submenu) {
                                                e.preventDefault();
                                                toggleSubsidebar(item?.label);
                                              }
                                            }}
                                          >
                                            {item?.label}
                                            {item?.submenu && (
                                              <span className="menu-arrow inside-submenu" />
                                            )}
                                          </Link>
                                        )}
                                      </li>
                                    );
                                  }
                                )}
                              </ul>
                            </li>
                          </React.Fragment>
                        );
                      })}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* <CollapsedSidebar /> */}
    </div>
  );
};

export default Sidebar;
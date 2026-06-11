/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Menu, Badge, Button, Popover, Drawer } from "antd";
import { DashboardOutlined, FileTextOutlined, TeamOutlined, AppstoreAddOutlined, MenuFoldOutlined, MenuUnfoldOutlined, ProjectOutlined, LineChartOutlined, BellOutlined, BarChartOutlined, CloseOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useNotificationContext } from "../../context/NotificationContext.jsx";
import { getPendingRepliesForRecipient, getInReviewReplyCount } from "../../api/repliedDocApi.js";
import { getDeadlineStatusCounts } from "../../api/documentApi.js";
import { getUserInfo } from "../../api/auth.js";
import "./bell.css";
import PropTypes from "prop-types";

const Sidebar = ({ mobileOpen, onMobileClose, onMenuItemClick }) => {
  const { unreadDocCount, myPendingReplyCount, userRole, userId } = useNotificationContext();
  const [totalPendingReplies, setTotalPendingReplies] = useState(0);
  const [bghInReviewCount, setBghInReviewCount] = useState(0);
  const [deadlineCounts, setDeadlineCounts] = useState({ soonCount: 0, dueTodayCount: 0, overdueCount: 0 });
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [userDepartmentCode, setUserDepartmentCode] = useState(null);

  const isAdmin = userRole === "admin" || userRole === "manager";
  const isStaff = userRole === "staff";
  const isBGH = userDepartmentCode === "BGH" || isAdmin;

  // Fetch user department info
  useEffect(() => {
    const fetchUserDepartment = async () => {
      if (userId) {
        try {
          const response = await getUserInfo(userId);
          if (response.success && response.data?.department) {
            const department = response.data.department;
            const departmentCode = typeof department === "object" ? department.departmentCode : null;
            // Chỉ set nếu departmentCode là "BGH"
            setUserDepartmentCode(departmentCode === "BGH" ? "BGH" : null);
          } else {
            setUserDepartmentCode(null);
          }
        } catch (error) {
          console.error("Error fetching user department:", error);
          setUserDepartmentCode(null);
        }
      }
    };
    fetchUserDepartment();
  }, [userId]);

  // Check if mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch pending replies
  useEffect(() => {
    let interval;
    const fetchPendingReplies = async () => {
      if (isAdmin && userId) {
        try {
          const count = await getPendingRepliesForRecipient(userId);
          setTotalPendingReplies(count);
        } catch (error) {
          setTotalPendingReplies(0);
        }
      }
    };

    fetchPendingReplies();
    interval = setInterval(fetchPendingReplies, 600000);

    return () => clearInterval(interval);
  }, [userId, isAdmin]);

  // Fetch BGH in-review count
  useEffect(() => {
    let interval;
    const fetchBghInReviewCount = async () => {
      // Check if user is BGH (departmentCode === "BGH" or is admin/manager)
      const isBGHUser = userDepartmentCode === "BGH" || isAdmin;
      if (isBGHUser && userId) {
        try {
          const count = await getInReviewReplyCount(userId);
          setBghInReviewCount(count);
        } catch (error) {
          setBghInReviewCount(0);
        }
      } else {
        setBghInReviewCount(0);
      }
    };

    fetchBghInReviewCount();
    interval = setInterval(fetchBghInReviewCount, 600000);

    return () => clearInterval(interval);
  }, [userId, userDepartmentCode, isAdmin]);

  // Show Popover when unread or pending exist
  useEffect(() => {
    if ((unreadDocCount > 0 || myPendingReplyCount > 0 || totalPendingReplies > 0 || bghInReviewCount > 0) && userId) {
      setShowPopover(true);

      const timer = setTimeout(() => {
        setShowPopover(false);
      }, 5000); // Hide after 5s

      return () => clearTimeout(timer);
    }
  }, [unreadDocCount, myPendingReplyCount, totalPendingReplies, bghInReviewCount, userId, isAdmin]);

  useEffect(() => {
    let interval;
    const fetchDeadlineCounts = async () => {
      if (userId) {
        try {
          const counts = await getDeadlineStatusCounts(userId);
          setDeadlineCounts(counts);
        } catch (error) {
          setDeadlineCounts({ soonCount: 0, dueTodayCount: 0, overdueCount: 0 });
        }
      }
    };

    fetchDeadlineCounts();
    interval = setInterval(fetchDeadlineCounts, 600000);

    return () => clearInterval(interval);
  }, [userId]);

  // Show Popover when there are notifications
  useEffect(() => {
    if ((deadlineCounts.soonCount > 0 || deadlineCounts.dueTodayCount > 0 || deadlineCounts.overdueCount > 0 || myPendingReplyCount > 0 || totalPendingReplies > 0 || bghInReviewCount > 0) && userId) {
      setShowPopover(true);
      const timer = setTimeout(() => setShowPopover(false), 5000 );
      return () => clearTimeout(timer);
    }
  }, [deadlineCounts, myPendingReplyCount, totalPendingReplies, bghInReviewCount, userId]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const createLinkItem = (path, label, badgeCount = null) => ({
    key: path,
    label: (
      <Link to={path} className="flex justify-between items-center">
        {label}
        {badgeCount !== null && (
          <Badge className="mr-5" count={badgeCount} showZero overflowCount={99} size="small" offset={[5, 0]} />
        )}
      </Link>
    ),
  });

  const menuItems = [
    { key: "/", icon: <DashboardOutlined />, label: <Link to="/">Dashboard</Link> },
    {
      key: "/documents",
      icon: <FileTextOutlined />,
      label: "Văn bản",
      children: [
        createLinkItem("/documents/ReceivedDocumentList", "Văn bản đến", unreadDocCount),
        ...(isAdmin
          ? [
            createLinkItem("/documents/SentDocumentList", "Tất cả văn bản"),
            { key: "/documents/create", label: <Link to="/documents/create">Ban hành văn bản</Link> },
          ]
          : []),
      ],
    },
    {
      key: "/reply",
      icon: <FileTextOutlined />,
      label: "Văn bản trình ký",
      children: [
        // Chỉ BGH (không phải manager/admin) mới chỉ hiển thị "BGH xét duyệt", ẩn "Tất cả văn bản" và "Trình ký"
        // Manager/admin thì hiển thị bình thường
        ...(userDepartmentCode === "BGH" && !isAdmin
          ? [createLinkItem("/bgh-review", "BGH xét duyệt", bghInReviewCount)]
          : [
              createLinkItem("/getAllRepliedDoc", "Tất cả văn bản", isAdmin ? totalPendingReplies : myPendingReplyCount),
              ...(isStaff ? [{ key: "/replyDoc", label: <Link to="/replyDoc">Trình ký</Link> }] : []),
              // Manager/admin là BGH vẫn hiển thị thêm "BGH xét duyệt"
              ...(isBGH && isAdmin ? [createLinkItem("/bgh-review", "BGH xét duyệt", bghInReviewCount)] : []),
            ]
        ),
      ],
    },
    ...(isAdmin
      ? [
       
        {
          key: "/report/Statistics",
          icon: <LineChartOutlined />,
          label: "Thống kê - Báo cáo",
          children: [
            { key: "/report", label: <Link to="/report">Báo cáo</Link> },
            { key: "/Statistics", label: <Link to="/Statistics">Thống kê</Link> },
          ],
        },
        {
          key: "/MenberManager",
          icon: <AppstoreAddOutlined />,
          label: "Quản lý",
          children: [
            { key: "/MenberManager/DepartmentForm", label: <Link to="/DepartmentForm">Quản lý phòng ban</Link> },
            { key: "/MenberManager/Position", label: <Link to="/Position">Quản lý Chức vụ</Link> },
            { key: "/MenberManager/Listusers", label: <Link to="/Listusers">Quản lý người dùng</Link> },
            { key: "/MenberManager/DocVariantPage", label: <Link to="/DocVariantPage">Quản lý loại văn bản</Link> },
            { key: "/Units", label: <Link to="/Units">Cơ quan ban hành</Link> },
          ],
        },
      ]
      : []),
    { key: "/members", icon: <TeamOutlined />, label: <Link to="/members">Thông tin cá nhân</Link> },
  ];

  // Tính tổng số lượng cần báo
  const totalNotifications = (unreadDocCount || 0) + (isAdmin ? (totalPendingReplies || 0) : (myPendingReplyCount || 0)) + (isBGH ? (bghInReviewCount || 0) : 0);


  const sidebarContent = (
    <div className="h-full bg-gray-800 text-white flex flex-col">
      <div className="flex justify-between items-center p-3 relative">
        {/* Bell + Popover - only show on desktop */}
        {!isMobile && (
          <Popover
            content={
              <div className="text-sm space-y-2">
                {unreadDocCount > 0 && (
                  <p>
                    <Link 
                      to="/documents/ReceivedDocumentList" 
                      className="text-black hover:text-blue-800 hover:underline"
                      onClick={() => setShowPopover(false)}
                    >
                      Bạn có tổng <b>{unreadDocCount}</b> văn bản đến chưa xem.
                    </Link>
                  </p>
                )}
                {deadlineCounts.soonCount > 0 && (
                  <p>
                    <Link 
                      to="/documents/ReceivedDocumentList" 
                      className="text- hover:text-blue-800 hover:underline"
                      onClick={() => setShowPopover(false)}
                    >
                      Có <b>{deadlineCounts.soonCount}</b> văn bản sắp đến hạn xử lý.
                    </Link>
                  </p>
                )}
                {deadlineCounts.dueTodayCount > 0 && (
                  <p>
                    <Link 
                      to="/documents/ReceivedDocumentList" 
                      className="text-black hover:text-blue-800 hover:underline"
                      onClick={() => setShowPopover(false)}
                    >
                      Có <b>{deadlineCounts.dueTodayCount}</b> văn bản đến hạn xử lý.
                    </Link>
                  </p>
                )}
                {deadlineCounts.overdueCount > 0 && (
                  <p>
                    <Link 
                      to="/documents/ReceivedDocumentList" 
                      className="text-black hover:text-blue-800 hover:underline"
                      onClick={() => setShowPopover(false)}
                    >
                      Có <b>{deadlineCounts.overdueCount}</b> văn bản quá hạn xử lý.
                    </Link>
                  </p>
                )}
                {(isAdmin ? totalPendingReplies : myPendingReplyCount) > 0 && (
                  <p>
                    <Link 
                      to="/getAllRepliedDoc" 
                      className="text-black hover:text-blue-800 hover:underline"
                      onClick={() => setShowPopover(false)}
                    >
                      Bạn có <b>{isAdmin ? totalPendingReplies : myPendingReplyCount}</b> văn bản trình ký cần xử lý.
                    </Link>
                  </p>
                )}
                {isBGH && bghInReviewCount > 0 && (
                  <p>
                    <Link 
                      to="/bgh-review" 
                      className="text-black hover:text-blue-800 hover:underline"
                      onClick={() => setShowPopover(false)}
                    >
                      Bạn có <b>{bghInReviewCount}</b> văn bản đang chờ BGH xét duyệt.
                    </Link>
                  </p>
                )}
              </div>
            }
            title="Thông báo mới"
            className="ml-2"
            trigger="click"
            open={showPopover}
            onOpenChange={(open) => {
              setShowPopover(open);

              if (open) {
                setTimeout(() => {
                  setShowPopover(false);
                }, 5000 );
              }
            }}
          >
            <Badge count={totalNotifications} size="small" offset={[-5, 5]}>
              <BellOutlined className={`text-white text-2xl cursor-pointer transition-all ${showPopover ? "shake" : ""}`} />
            </Badge>
          </Popover>
        )}

        {/* Right side - Close button for mobile, Collapse button for desktop */}
        <div className="flex items-center space-x-2">
          {isMobile && (
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={onMobileClose}
              className="text-white hover:text-gray-300 text-lg"
              size="large"
            />
          )}
          {!isMobile && (
            <Button
              type="text"
              icon={isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-white hover:text-gray-300"
            />
          )}
        </div>
      </div>

      <Menu
        mode="inline"
        theme="dark"
        inlineCollapsed={isMobile ? false : isCollapsed}
        defaultSelectedKeys={["/"]}
        className="flex-1 border-none bg-gray-800"
        style={{ fontSize: "16px", fontWeight: "bold" }}
        items={menuItems}
        onClick={(e) => {
          // Chỉ tự động ẩn menu trên mobile khi click vào menu item
          if (isMobile && onMenuItemClick && e.key !== "/") {
            onMenuItemClick();
          }
        }}
      />
    </div>
  );

  // Mobile drawer
  if (isMobile) {
     return (
       <Drawer
         title=""
         placement="left"
         onClose={onMobileClose}
         open={mobileOpen}
         width={280}
         bodyStyle={{ padding: 0 }}
         className="mobile-sidebar-drawer"
         closable={false}
         maskClosable={true}
       >
         {sidebarContent}
       </Drawer>
     );
  }

  // Desktop sidebar
  return (
    <div 
      className="h-full bg-gray-800 text-white flex flex-col" 
      style={{ 
        width: isCollapsed ? "100px" : "300px", 
        transition: "width 0.3s",
        minWidth: isCollapsed ? "100px" : "300px"
      }}
    >
      {sidebarContent}
    </div>
  );
};

Sidebar.propTypes = {
  mobileOpen: PropTypes.bool.isRequired,
  onMobileClose: PropTypes.func.isRequired,
  onMenuItemClick: PropTypes.func,
};

export default Sidebar;

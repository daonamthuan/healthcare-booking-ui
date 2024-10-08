export const adminMenu = [
    {
        // QUẢN LÝ NGƯỜI DÙNG
        name: "menu.admin.manage-user",
        menus: [
            {
                name: "menu.admin.crud",
                link: "/system/user-manage",
            },
            {
                name: "menu.admin.crud-redux",
                link: "/system/user-redux",
            },
            {
                name: "menu.admin.manage-doctor",
                link: "/system/manage-doctor",
                // subMenus: [
                //     {
                //         name: "menu.system.system-administrator.user-manage",
                //         link: "/system/user-manage",
                //     },
                //     {
                //         name: "menu.system.system-administrator.user-redux",
                //         link: "/system/user-redux",
                //     },
                // ],
            },
            // {
            //     name: "menu.admin.manage-admin",
            //     link: "/system/user-admin",
            // },
            {
                // QUẢN LÝ KẾ HOẠCH KHÁM BỆNH BÁC SĨ
                name: "menu.doctor.manage-schedule",
                link: "/doctor/manage-schedule",
            },
        ],
    },
    {
        // QUẢN LÝ PHÒNG KHÁM
        name: "menu.admin.clinic",
        menus: [
            {
                name: "menu.admin.manage-clinic",
                link: "/system/manage-clinic",
            },
        ],
    },
    {
        // QUẢN LÝ SPECIALTY
        name: "menu.admin.specialty",
        menus: [
            {
                name: "menu.admin.manage-specialty",
                link: "/system/manage-specialty",
            },
        ],
    },
    {
        // QUẢN LÝ CẨM NANG
        name: "menu.admin.handbook",
        menus: [
            {
                name: "menu.admin.manage-handbook",
                link: "/system/manage-handbook",
            },
        ],
    },
];

export const doctorMenu = [
    {
        // QUẢN LÝ KẾ HOẠCH KHÁM BỆNH BÁC SĨ
        name: "menu.admin.manage-user",
        menus: [
            {
                // quản lý kế hoạch khám bệnh của bác sĩ
                name: "menu.doctor.manage-schedule",
                link: "/doctor/manage-schedule",
            },
            {
                // quản lý bệnh nhân khám bệnh của bác sĩ
                name: "menu.doctor.manage-patient",
                link: "/doctor/manage-patient",
            },
        ],
    },
];

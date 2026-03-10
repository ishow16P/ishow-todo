import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const messages = {
  th: {
    // Navbar
    projects: 'โปรเจค',
    calendar: 'ปฏิทิน',
    logout: 'ออกจากระบบ',
    switchToLight: 'สลับเป็น Light',
    switchToDark: 'สลับเป็น Dark',

    // Auth
    login: 'เข้าสู่ระบบ',
    loggingIn: 'กำลังเข้าสู่ระบบ...',
    loginFailed: 'เข้าสู่ระบบไม่สำเร็จ',
    register: 'สมัครสมาชิก',
    registering: 'กำลังสมัคร...',
    registerFailed: 'สมัครสมาชิกไม่สำเร็จ',
    email: 'อีเมล',
    password: 'รหัสผ่าน',
    name: 'ชื่อ',
    yourName: 'ชื่อของคุณ',
    minChars: 'อย่างน้อย 6 ตัวอักษร',
    noAccount: 'ยังไม่มีบัญชี?',
    hasAccount: 'มีบัญชีอยู่แล้ว?',

    // Projects
    myProjects: 'โปรเจคของฉัน',
    createProject: '+ สร้างโปรเจค',
    loading: 'กำลังโหลด...',
    noProjects: 'ยังไม่มีโปรเจค',
    createFirstProject: 'สร้างโปรเจคแรกของคุณ',
    searchProjects: 'ค้นหาโปรเจค...',
    sortNewest: 'ใหม่ล่าสุด',
    sortName: 'ชื่อ A-Z',
    sortMembers: 'สมาชิกมากสุด',
    noSearchResults: 'ไม่พบโปรเจคที่ค้นหา',
    noDescription: 'ไม่มีคำอธิบาย',
    members: 'สมาชิก',
    statuses: 'สถานะ',
    newProject: 'สร้างโปรเจคใหม่',
    projectName: 'ชื่อโปรเจค',
    descriptionOptional: 'คำอธิบาย (ไม่บังคับ)',
    projectDescPlaceholder: 'รายละเอียดโปรเจค...',
    projectNamePlaceholder: 'เช่น Sprint 1',
    cancel: 'ยกเลิก',
    creating: 'กำลังสร้าง...',
    create: 'สร้าง',
    deleteProject: 'ลบโปรเจค',
    deleteProjectTitle: 'ลบโปรเจค?',
    deleteProjectText: 'ข้อมูลทั้งหมดจะถูกลบและไม่สามารถกู้คืนได้',
    deleteConfirm: 'ลบเลย',

    // Board
    status: 'สถานะ',
    addStatus: '+ สถานะ',
    editTask: 'แก้ไข Task',
    title: 'ชื่อ',
    description: 'รายละเอียด',
    descPlaceholder: 'พิมพ์รายละเอียด...',
    startDate: 'วันเริ่มต้น',
    endDate: 'วันสิ้นสุด',
    selectStartDate: 'เลือกวันเริ่มต้น',
    selectEndDate: 'เลือกวันสิ้นสุด',
    assignee: 'ผู้รับผิดชอบ',
    unassigned: 'ไม่ระบุ',
    save: 'บันทึก',
    delete: 'ลบ',
    edit: 'แก้ไข',
    close: 'ปิด',
    start: 'เริ่ม',
    end: 'สิ้นสุด',
    noDetails: 'ไม่มีรายละเอียด',
    deleteTaskTitle: 'ลบ Task?',
    deleteTaskText: 'จะถูกลบและไม่สามารถกู้คืนได้',
    deleteStatusTitle: 'ลบสถานะ?',
    deleteStatusText: '(ต้องไม่มี task อยู่ในสถานะนี้)',
    errorTitle: 'เกิดข้อผิดพลาด',
    deleteStatusFailed: 'ลบสถานะไม่สำเร็จ',
    dragToReorder: 'ลากเพื่อสลับตำแหน่ง',
    deleteStatus: 'ลบสถานะ',

    // Board Column
    addTask: '+ เพิ่ม task',
    addTaskIn: 'เพิ่ม Task ใน',
    taskNamePlaceholder: 'ชื่อ task...',
    add: 'เพิ่ม',

    // Task Card
    hasDetails: 'มีรายละเอียด',
    viewDetails: 'ดูรายละเอียด',

    // AddStatusModal
    addNewStatus: 'เพิ่มสถานะใหม่',
    statusName: 'ชื่อสถานะ',
    statusNamePlaceholder: 'เช่น Review, Testing',
    color: 'สี',
    addStatusFailed: 'เพิ่มสถานะไม่สำเร็จ',

    // InviteMemberModal
    manageMembers: 'จัดการสมาชิก',
    inviteEmailPlaceholder: 'อีเมลที่ต้องการเชิญ',
    invite: 'เชิญ',
    owner: 'เจ้าของ',
    inviteSuccess: 'สำเร็จ',
    inviteFailed: 'เชิญสมาชิกไม่สำเร็จ',
    removeMemberFailed: 'ลบสมาชิกไม่สำเร็จ',

    // Calendar
    today: 'วันนี้',
    allProjects: 'ทุกโปรเจค',
    more: 'อื่นๆ',
    dueDate: 'ครบกำหนด',
    goToBoard: 'ไปที่บอร์ด →',
    dayMon: 'จ.',
    dayTue: 'อ.',
    dayWed: 'พ.',
    dayThu: 'พฤ.',
    dayFri: 'ศ.',
    daySat: 'ส.',
    daySun: 'อา.',
  },

  en: {
    // Navbar
    projects: 'Projects',
    calendar: 'Calendar',
    logout: 'Log out',
    switchToLight: 'Switch to Light',
    switchToDark: 'Switch to Dark',

    // Auth
    login: 'Log in',
    loggingIn: 'Logging in...',
    loginFailed: 'Login failed',
    register: 'Register',
    registering: 'Registering...',
    registerFailed: 'Registration failed',
    email: 'Email',
    password: 'Password',
    name: 'Name',
    yourName: 'Your name',
    minChars: 'At least 6 characters',
    noAccount: "Don't have an account?",
    hasAccount: 'Already have an account?',

    // Projects
    myProjects: 'My Projects',
    createProject: '+ New Project',
    loading: 'Loading...',
    noProjects: 'No projects yet',
    createFirstProject: 'Create your first project',
    searchProjects: 'Search projects...',
    sortNewest: 'Newest first',
    sortName: 'Name A-Z',
    sortMembers: 'Most members',
    noSearchResults: 'No projects found',
    noDescription: 'No description',
    members: 'members',
    statuses: 'statuses',
    newProject: 'Create New Project',
    projectName: 'Project name',
    descriptionOptional: 'Description (optional)',
    projectDescPlaceholder: 'Project details...',
    projectNamePlaceholder: 'e.g. Sprint 1',
    cancel: 'Cancel',
    creating: 'Creating...',
    create: 'Create',
    deleteProject: 'Delete project',
    deleteProjectTitle: 'Delete project?',
    deleteProjectText: 'All data will be permanently deleted',
    deleteConfirm: 'Delete',

    // Board
    status: 'Status',
    addStatus: '+ Status',
    editTask: 'Edit Task',
    title: 'Title',
    description: 'Description',
    descPlaceholder: 'Type description...',
    startDate: 'Start date',
    endDate: 'End date',
    selectStartDate: 'Select start date',
    selectEndDate: 'Select end date',
    assignee: 'Assignee',
    unassigned: 'Unassigned',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    close: 'Close',
    start: 'Start',
    end: 'End',
    noDetails: 'No details',
    deleteTaskTitle: 'Delete task?',
    deleteTaskText: 'will be permanently deleted',
    deleteStatusTitle: 'Delete status?',
    deleteStatusText: '(must have no tasks in this status)',
    errorTitle: 'Error',
    deleteStatusFailed: 'Failed to delete status',
    dragToReorder: 'Drag to reorder',
    deleteStatus: 'Delete status',

    // Board Column
    addTask: '+ Add task',
    addTaskIn: 'Add Task in',
    taskNamePlaceholder: 'Task name...',
    add: 'Add',

    // Task Card
    hasDetails: 'Has details',
    viewDetails: 'View details',

    // AddStatusModal
    addNewStatus: 'Add New Status',
    statusName: 'Status name',
    statusNamePlaceholder: 'e.g. Review, Testing',
    color: 'Color',
    addStatusFailed: 'Failed to add status',

    // InviteMemberModal
    manageMembers: 'Manage Members',
    inviteEmailPlaceholder: 'Email to invite',
    invite: 'Invite',
    owner: 'Owner',
    inviteSuccess: 'Success',
    inviteFailed: 'Failed to invite member',
    removeMemberFailed: 'Failed to remove member',

    // Calendar
    today: 'Today',
    allProjects: 'All projects',
    more: 'more',
    dueDate: 'Due',
    goToBoard: 'Go to board →',
    dayMon: 'Mon',
    dayTue: 'Tue',
    dayWed: 'Wed',
    dayThu: 'Thu',
    dayFri: 'Fri',
    daySat: 'Sat',
    daySun: 'Sun',
  },
}

export const useLocaleStore = defineStore('locale', () => {
  const lang = ref(localStorage.getItem('lang') || 'th')

  const t = computed(() => messages[lang.value] || messages.th)

  function setLang(l) {
    lang.value = l
    localStorage.setItem('lang', l)
  }

  function toggle() {
    setLang(lang.value === 'th' ? 'en' : 'th')
  }

  const dateLang = computed(() => (lang.value === 'th' ? 'th-TH' : 'en-US'))

  return { lang, t, setLang, toggle, dateLang }
})

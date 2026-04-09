<template>
    <div class="all-user">
        <el-card style="min-height: 700px;">
            <div class="header">
                <span class="title">用户管理</span>

                <div class="actions">
                    <el-input
                        v-model="filterKeyword"
                        placeholder="按姓名或职工号搜索"
                        style="width: 220px"
                        clearable
                    />
                    <el-button type="primary" @click="openAdd">新增用户</el-button>
                    <el-button type="warning" @click="resetData">重置数据</el-button>
                </div>
            </div>

            <!-- 用户列表 -->
            <el-table :data="filteredUsers" border style="width: 100%; margin-top: 12px">
                <el-table-column prop="name" label="姓名" width="120"/>
                <el-table-column prop="staffId" label="职工号" width="120"/>
                <el-table-column prop="role" label="权限" width="120"/>
                <el-table-column label="最近一次登录时间" width="200">
                    <template #default="scope">
                        {{ formatDate(scope.row.lastLogin) }}
                    </template>
                </el-table-column>
                <el-table-column prop="applyCount" label="申请物资数量" width="150"/>
                <el-table-column prop="purpose" label="用途"/>

                <el-table-column label="操作" width="220">
                    <template #default="scope">
                        <el-button size="small" @click="openView(scope.row)">查看</el-button>
                        <el-button size="small" type="primary" @click="openEdit(scope.row)">编辑</el-button>
                        <el-button size="small" type="danger" @click="removeUser(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div v-if="filteredUsers.length === 0" style="text-align:center; padding:20px; color:#888">
                没有匹配的数据
            </div>
        </el-card>

        <!-- 新增 / 编辑抽屉 -->
        <el-drawer
            v-model="isFormOpen"
            title="用户信息"
            direction="rtl"
            size="420px"
        >
            <el-form :model="editingUser" label-width="120px">
                <el-form-item label="姓名">
                    <el-input v-model="editingUser.name" />
                </el-form-item>

                <el-form-item label="职工号">
                    <el-input v-model="editingUser.staffId" />
                </el-form-item>

                <el-form-item label="权限">
                    <el-select v-model="editingUser.role" style="width:100%">
                        <el-option label="普通用户" value="普通用户"/>
                        <el-option label="管理员" value="管理员"/>
                        <el-option label="运维" value="运维"/>
                    </el-select>
                </el-form-item>

                <el-form-item label="最近一次登录">
                    <el-date-picker
                        v-model="editingUser.lastLoginInput"
                        type="datetime"
                        value-format="YYYY-MM-DDTHH:mm"
                        style="width:100%"
                    />
                </el-form-item>

                <el-form-item label="申请物资数量">
                    <el-input-number v-model="editingUser.applyCount" :min="0" />
                </el-form-item>

                <el-form-item label="用途">
                    <el-input v-model="editingUser.purpose" />
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="saveUser">保存</el-button>
                    <el-button @click="isFormOpen = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>

        <!-- 查看详情 -->
        <el-dialog v-model="isViewOpen" title="用户详情" width="420px">
            <el-descriptions column="1" border>
                <el-descriptions-item label="姓名">{{ viewUser.name }}</el-descriptions-item>
                <el-descriptions-item label="职工号">{{ viewUser.staffId }}</el-descriptions-item>
                <el-descriptions-item label="权限">{{ viewUser.role }}</el-descriptions-item>
                <el-descriptions-item label="最近一次登录">
                    {{ formatDate(viewUser.lastLogin) }}
                </el-descriptions-item>
                <el-descriptions-item label="申请物资数量">{{ viewUser.applyCount }}</el-descriptions-item>
                <el-descriptions-item label="用途">{{ viewUser.purpose }}</el-descriptions-item>
            </el-descriptions>

            <template #footer>
                <el-button @click="isViewOpen = false">关闭</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'

function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

const initialData = () => ([
    {
        id: uid(),
        name: '张三',
        staffId: '1001',
        role: '管理员',
        lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
        applyCount: 3,
        purpose: '救援物资',
    },
    {
        id: uid(),
        name: '李四',
        staffId: '1002',
        role: '普通用户',
        lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 5),
        applyCount: 1,
        purpose: '办公用品',
    },
    {
        id: uid(),
        name: '王五',
        staffId: '1003',
        role: '运维',
        lastLogin: new Date(),
        applyCount: 5,
        purpose: '维修器材',
    },
])

const users = ref(initialData())
const filterKeyword = ref('')

const filteredUsers = computed(() => {
    const kw = filterKeyword.value.trim().toLowerCase()
    if (!kw) return users.value
    return users.value.filter(u =>
        u.name.toLowerCase().includes(kw) ||
        u.staffId.toLowerCase().includes(kw)
    )
})

const isFormOpen = ref(false)
const isViewOpen = ref(false)

const editingUser = reactive({
    id: '',
    name: '',
    staffId: '',
    role: '普通用户',
    lastLogin: new Date(),
    lastLoginInput: '',
    applyCount: 0,
    purpose: '',
})

const viewUser = reactive({
    id: '',
    name: '',
    staffId: '',
    role: '',
    lastLogin: '',
    applyCount: 0,
    purpose: '',
})

function toInputDatetime(d) {
    const date = new Date(d)
    const yyyy = date.getFullYear()
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const dd = String(date.getDate()).padStart(2, '0')
    const hh = String(date.getHours()).padStart(2, '0')
    const mi = String(date.getMinutes()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`
}

function openAdd() {
    Object.assign(editingUser, {
        id: '',
        name: '',
        staffId: '',
        role: '普通用户',
        lastLogin: new Date(),
        lastLoginInput: toInputDatetime(new Date()),
        applyCount: 0,
        purpose: '',
    })
    isFormOpen.value = true
}

function openEdit(user) {
    Object.assign(editingUser, {
        id: user.id,
        name: user.name,
        staffId: user.staffId,
        role: user.role,
        lastLogin: user.lastLogin,
        lastLoginInput: toInputDatetime(user.lastLogin),
        applyCount: user.applyCount,
        purpose: user.purpose,
    })
    isFormOpen.value = true
}

function openView(user) {
    Object.assign(viewUser, user)
    isViewOpen.value = true
}

function saveUser() {
    const parsed = new Date(editingUser.lastLoginInput)

    if (editingUser.id) {
        // 编辑
        const idx = users.value.findIndex(u => u.id === editingUser.id)
        if (idx !== -1) {
            users.value[idx] = { ...editingUser, lastLogin: parsed }
        }
        ElMessage.success('修改成功')
    } else {
        // 新增
        users.value.unshift({
            id: uid(),
            name: editingUser.name,
            staffId: editingUser.staffId,
            role: editingUser.role,
            lastLogin: parsed,
            applyCount: editingUser.applyCount,
            purpose: editingUser.purpose,
        })
        ElMessage.success('新增成功')
    }
    isFormOpen.value = false
}

function removeUser(user) {
    ElMessageBox.confirm(
        `确认删除用户 ${user.name} (${user.staffId}) 吗？`,
        '提示',
        { type: 'warning' }
    ).then(() => {
        users.value = users.value.filter(u => u.id !== user.id)
        ElMessage.success('删除成功')
    })
}

function resetData() {
    ElMessageBox.confirm('重置为初始假数据？当前修改将丢失。', '警告')
        .then(() => {
            users.value = initialData()
            ElMessage.success('已重置')
        })
}

function formatDate(d) {
    if (!d) return '-'
    const date = new Date(d)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}
</script>

<style scoped>
.all-user {
    max-width: 1400px;
    margin: 20px auto;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.title {
    font-size: 20px;
    font-weight: bold;
}

.actions {
    display: flex;
    gap: 10px;
}
</style>

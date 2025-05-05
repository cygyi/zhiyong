<script setup>
import {onBeforeMount, reactive, ref} from "vue";
import {DollarOutlined, PlusCircleOutlined, MinusCircleOutlined, CloseCircleOutlined} from "@ant-design/icons-vue";
import {message} from "ant-design-vue";

const arrData = reactive({
  columns: [{
    title: '特码',
    dataIndex: 'specialCode',
    key: 'specialCode',
  },
    {
      title: '押注费用',
      dataIndex: 'fees',
      key: 'fees',
      sorter: (a, b) => a.fees - b.fees,
      defaultSortOrder: 'descend'
    },
    {
      title: '开奖扣除成本支出费用',
      dataIndex: 'lottery',
      key: 'lottery',
    },
  ],
  dataSource: []
})

const scrollOptions = {
  y: '85vh'
}

const BetArr = reactive([{
  id: 0,
  BetNumbers: 1,
  BetFees: 0
}])

const ClaimMultiples = ref(42)
const totalFees = ref(0)
const lotteryNumbers = ref(null)
const rebates = ref(4)
const open = ref(false)
const lotteryMoney = ref(0)

// 加载初始数据
onBeforeMount(() => {
  let arr = []
  for (let i = 1; i < 50; i++) {
    arr.push({
      key: i,
      specialCode: i,
      fees: 0,
      lottery: 0,
    },)

    if (i === 49) {
      arrData.dataSource = arr
    }
  }
})

// 确认下注
function ConfirmTheBet() {
  BetArr.forEach(item => {
    let fees = item.BetFees || 0
    arrData.dataSource[item.BetNumbers - 1].fees += fees

    item.BetFees = 0
  })
  // 计算总费用
  totalFees.value = arrData.dataSource.reduce((acc, cur) => acc + cur.fees, 0)

  message.success('已下注~')

}

// 操作多个输入
function handleBetArr(type) {
  if (type === 'add') { // 添加
    if (BetArr.length === 10) {
      return message.error('只能添加10个！')
    }

    BetArr.push({
      id: BetArr.length + 1,
      BetNumbers: 1,
      BetFees: 0
    })
  } else if (type === 'del') { // 删除
    if (BetArr.length === 1) {
      return message.error('最后一个不可删除！')
    }

    BetArr.pop({
      id: BetArr.length + 1,
      BetNumbers: 1,
      BetFees: 0
    })
  } else { // 全部清空
    BetArr.splice(1)
  }
}

// 查看结果
function confirm() {
  if (!lotteryNumbers.value) {
    return message.error('请输入开奖号码')
  }

  open.value = true

  const findData = arrData.dataSource.find(item => item.specialCode === lotteryNumbers.value)

  const data = JSON.parse(JSON.stringify(findData))

  console.log(data)

  lotteryMoney.value = data.fees * ClaimMultiples.value - totalFees.value
}
</script>

<template>
  <div class="body">
    <div class="results">
      <a-table :columns="arrData.columns" :dataSource="arrData.dataSource" :pagination='false' :scroll="scrollOptions">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'lottery'">
            <div v-if="record.fees === 0">0</div>
            <div v-else :style="{color: ClaimMultiples * record.fees - totalFees > 0 ? 'green' : 'red'}">
              {{ (ClaimMultiples * record.fees) - Number(totalFees) }}
            </div>
          </template>
        </template>
      </a-table>
    </div>
    <!-- 操作区域 -->
    <div style="width: 30vw;">
      <a-card>
        <div style="display: flex;align-items: center;">
          <div style="font-size: 18px;font-weight: 700;">设置理赔倍数：</div>
          <a-input-number v-model:value="ClaimMultiples" :max="49" :min="1" size="large" style="flex: 1;"/>
        </div>

        <div style="margin: 20px 0;display: flex;justify-content: space-between;">
          <a-tag color="purple" style="padding: 5px 15px;">
            <DollarOutlined style="font-size: 18px;"/>
            <span style="font-size: 16px;font-weight: 700">请输入下注号码费用</span>
          </a-tag>

          <div style="display: flex;align-items: center;gap:20px;">
            <PlusCircleOutlined style="font-size: 28px;color: cornflowerblue;cursor: pointer;"
                                @click="handleBetArr('add')"/>
            <MinusCircleOutlined style="font-size: 28px;color: indianred;cursor: pointer;"
                                 @click="handleBetArr('del')"/>
            <CloseCircleOutlined style="font-size: 28px;color: gray;cursor: pointer;"
                                 @click="handleBetArr('close')"/>
          </div>
        </div>
        <div v-for="item in BetArr" :key="item.id"
             style="display: flex;align-items: center;gap: 10px;margin-bottom: 10px;">
          <div style="flex: 1;display: flex;align-items: center;">下注号码：
            <a-input-number v-model:value="item.BetNumbers" :max="49" :min="1" size="large" style="flex: 1;"/>
          </div>
          <div style="flex: 1;display: flex;align-items: center;">下注费用：
            <a-input-number v-model:value="item.BetFees" :max="100000" :min="0" size="large" style="flex: 1;"/>
          </div>
        </div>

        <div>
          <a-button size="large" style="margin: 10px 0;width: 100%;" type="primary" @click="ConfirmTheBet">确认下注
          </a-button>
        </div>

        <div style="margin: 20px 0;">
          <a-tag color="purple" style="padding: 5px 15px;">
            <DollarOutlined style="font-size: 18px;"/>
            <span style="font-size: 16px;font-weight: 700">请输入开奖特码</span>
          </a-tag>
        </div>

        <div style="flex: 1;display: flex;align-items: center;">开奖号码：
          <a-input-number v-model:value="lotteryNumbers" :max="49" :min="1" size="large" style="flex: 1;"/>
        </div>

        <div style="display: flex;align-items: center;gap: 10px;margin: 10px 0;">
          <img alt="" src="../../../public/images/icon_total.png" style="width: 24px;height: 24px;">
          <div style="font-size: 20px;font-weight: 700;color: dodgerblue;">当前下注总计：{{ totalFees }}</div>
        </div>

        <a-button size="large" style="margin: 10px 0;width: 100%;" type="primary" @click="confirm">查看结果</a-button>
      </a-card>
    </div>
  </div>
  <!-- 确认结果弹窗 -->
  <a-modal v-model:open="open" title="开奖结果计算" @ok="() => open = false">
    <div style="display: flex;align-items: center;gap: 10px;margin: 10px 0;">
      <img alt="" src="../../../public/images/icon_number.png" style="width: 24px;height: 24px;">
      <div style="font-size: 20px;font-weight: 700;color: dodgerblue;">开奖号码为：{{ lotteryNumbers }}</div>
    </div>
    <div style="display: flex;align-items: center;gap: 10px;margin: 10px 0;">
      <img alt="" src="../../../public/images/icon_total.png" style="width: 24px;height: 24px;">
      <div style="font-size: 20px;font-weight: 700;color: dodgerblue;">下注总计费用：{{ totalFees }}</div>
    </div>
    <div style="display: flex;align-items: center;gap: 10px;margin: 10px 0;">
      <img alt="" src="../../../public/images/icon_total.png" style="width: 24px;height: 24px;">
      <div style="font-size: 20px;font-weight: 700;color: dodgerblue;">
        （开奖号码赔 - 下注总费用）：
      </div>
    </div>
    <div style="display: flex;align-items: center;gap: 10px;margin: 10px 0;">
      <div :style="{fontSize: '20px', fontWeight: '700', color: lotteryMoney > 0 ? 'green' : 'red'}">
        {{
          lotteryMoney + totalFees
        }} - {{ totalFees }} = {{ lotteryMoney }}
      </div>

    </div>
    <div style="display: flex;align-items: center;gap: 10px;margin: 10px 0;">
      <img alt="" src="../../../public/images/icon_fanli.png" style="width: 28px;height: 28px;">
      <div style="font-size: 20px;font-weight: 700;color: dodgerblue;display: flex;align-items: center;">
        输入返利百分比
        <a-input-number v-model:value="rebates" :max="100" :min="1" addon-after="%" size="large"
                        style="flex: 1;"/>
      </div>
    </div>
    <div style="display: flex;align-items: center;gap: 10px;margin: 10px 0;">
      <img alt="" src="../../../public/images/icon_total.png" style="width: 24px;height: 24px;">
      <div style="font-size: 20px;font-weight: 700;color: dodgerblue;">扣除返利总费用（四舍五入）：{{
          Number(lotteryMoney * ((100 - rebates) / 100)).toFixed(2)
        }}
      </div>
    </div>
  </a-modal>
</template>

<style lang="less" scoped>
.body {
  width: 100vw;
  height: 100vh;
  display: flex;
  gap: 20px;
  padding: 20px;

  .results {
    width: 70vw;
    flex: 1;
    height: 100%;
    //overflow-y: scroll;
    //padding: 20px;
  }
}
</style>
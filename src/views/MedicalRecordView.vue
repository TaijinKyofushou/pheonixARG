<script setup lang="ts">
import type { FullPageNode } from '@/types/story'
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

/** 仅用于地址栏展示的解密线索，应用内不读取校验 */
const MEDICAL_RECORD_URL_PASSWORD = 'GUtoA7sX'
const MEDICAL_RECORD_URL_ID = 'Bell'

defineProps<{
  node: FullPageNode
}>()

const route = useRoute()
const router = useRouter()

onMounted(() => {
  if (
    route.query.userId !== MEDICAL_RECORD_URL_ID ||
    route.query.PASSWORD !== MEDICAL_RECORD_URL_PASSWORD
  ) {
    router.replace({
      path: route.path,
      query: {
        ...route.query,
        userId: MEDICAL_RECORD_URL_ID,
        password: MEDICAL_RECORD_URL_PASSWORD,
      },
    })
  }
})

function back() {
  const lastPath = window.history.state?.back
  if (lastPath === '/node/19') {
    router.push('/node/19')
    return
  }
  if (lastPath === '/node/23') {
    router.push('/node/23')
    return
  }
  if (lastPath === '/node/1') {
    router.push('/node/1')
    return
  }
  router.push('/node/1')
}
</script>

<template>
  <div class="wrap">
    <header class="top">
      <button type="button" class="back" @click="back">返回</button>
      <div class="user">欢迎您，梁先生！</div>
    </header>

    <article class="medical-record">
      <header class="record-header">
        <h1 class="hospital-name">北京大学第三医院</h1>
        <h2 class="record-title">住院志</h2>
      </header>

      <!-- 基本信息表格 - 四列布局 -->
      <section class="info-section">
        <table class="record-table">
          <tbody>
            <tr>
              <td class="label">姓名</td>
              <td class="value">张一然</td>
              <td class="label">年龄</td>
              <td class="value">25岁</td>
            </tr>
            <tr>
              <td class="label">性别</td>
              <td class="value">男</td>
              <td class="label">出生年月</td>
              <td class="value">2001-06-11</td>
            </tr>
            <tr>
              <td class="label">职业</td>
              <td class="value">学生</td>
              <td class="label">科室</td>
              <td class="value">呼吸与危重症医学科</td>
            </tr>
            <tr>
              <td class="label">床位号</td>
              <td class="value">12</td>
              <td class="label">住院号</td>
              <td class="value">300047</td>
            </tr>
            <tr>
              <td class="label">婚姻</td>
              <td class="value">未婚</td>
              <td class="label">入院时间</td>
              <td class="value">2026-03-15 10:15</td>
            </tr>
            <tr>
              <td class="label">家庭（户口）住址</td>
              <td class="value" colspan="3">北京市海淀区西土城路10号</td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- 病人主诉 -->
      <section class="record-section">
        <h3 class="section-title">病人主诉</h3>
        <div class="section-content bordered">
          <p>持续性胸闷、呼吸困难1月，加重伴咯血3天。</p>
        </div>
      </section>

      <!-- 现病史 -->
      <section class="record-section">
        <h3 class="section-title">现病史</h3>
        <div class="section-content bordered">
          <p>患者于2月中旬起无明显诱因出现胸闷、气短，活动后加重，伴乏力、食欲减退。3天前症状急剧加重，出现夜间阵发性呼吸困难，无法平卧，咳嗽伴痰中带血。今日晨起咯血约50ml，色鲜红，遂由家属陪同来院就诊。</p>
          <p>患者自述年初起体力明显下降，反复出现低热（37.5℃-38.2℃），无明确感染病灶。近一月体重下降约8kg。</p>
          <p>患者曾于2026年1月因急性支气管炎于我院门诊就诊，当时胸部CT提示双肺间质性改变，未予特殊处理。</p>
        </div>
      </section>

      <!-- 既往史 -->
      <section class="record-section">
        <h3 class="section-title">既往史</h3>
        <table class="record-table">
          <tbody>
            <tr>
              <td class="label">平素健康状况</td>
              <td class="value" colspan="3">
                <span class="checkbox">☐ 良好</span>
                <span class="checkbox checked">☑ 一般</span>
                <span class="checkbox">☐ 较差</span>
              </td>
            </tr>
            <tr>
              <td class="label">既往疾病史</td>
              <td class="value" colspan="3">2010年因火灾吸入性损伤，致慢性间质性肺炎；2015年诊断为支气管扩张；2024年诊断慢性肾功能不全（早期）。</td>
            </tr>
            <tr>
              <td class="label">手术外伤史</td>
              <td class="value" colspan="3">2010年深II度烧伤、因吸入性损伤行肺部手术。</td>
            </tr>
            <tr>
              <td class="label">过敏史</td>
              <td class="value">无</td>
              <td class="label">输血史</td>
              <td class="value">无</td>
            </tr>
            <tr>
              <td class="label">预防接种史</td>
              <td class="value" colspan="3">不详</td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- 体格检查 -->
      <section class="record-section">
        <h3 class="section-title">体格检查</h3>
        <table class="record-table">
          <tbody>
            <tr>
              <td class="label">生命体征</td>
              <td class="value" colspan="3">T：38.5℃ P：112次/分 R：28次/分 BP：95/60mmHg SpO2：88%（静息）</td>
            </tr>
            <tr>
              <td class="label">一般情况</td>
              <td class="value" colspan="3">发育正常，营养中等，神志清楚，精神萎靡，被动体位，查体合作。</td>
            </tr>
            <tr>
              <td class="label">呼吸系统</td>
              <td class="value" colspan="3">双肺呼吸音粗，可闻及广泛湿啰音及少量哮鸣音。咳嗽无力，痰中带血。</td>
            </tr>
            <tr>
              <td class="label">心血管系统</td>
              <td class="value" colspan="3">心率112次/分，律齐，心音低钝，未闻及病理性杂音。</td>
            </tr>
            <tr>
              <td class="label">消化系统</td>
              <td class="value" colspan="3">腹软，无压痛，肝脾肋下未触及。</td>
            </tr>
            <tr>
              <td class="label">其他</td>
              <td class="value" colspan="3">双下肢轻度凹陷性水肿。皮肤黏膜苍白，口唇发绀。手足可见散在红斑，患者自述"触之灼热"，无明确皮损。</td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- 初步诊断 -->
      <section class="record-section">
        <h3 class="section-title">初步诊断</h3>
        <div class="section-content bordered">
          <ol>
            <li>间质性肺炎伴急性加重</li>
            <li>多器官功能衰竭（待查）</li>
            <li>慢性肾功能不全（急性加重）</li>
            <li>呼吸衰竭（Ⅰ型）</li>
            <li>病因不明性全身代谢紊乱</li>
          </ol>
        </div>
      </section>

      <!-- 诊疗计划 -->
      <section class="record-section">
        <h3 class="section-title">诊疗计划</h3>
        <div class="section-content bordered">
          <ol>
            <li>收入院，予吸氧、抗感染、对症支持治疗</li>
            <li>完善相关检查：血常规、生化全项、凝血功能、自身免疫抗体谱、胸部高分辨率CT</li>
            <li>请肾内科、呼吸科、风湿免疫科会诊</li>
            <li>必要时行支气管镜检查</li>
          </ol>
        </div>
      </section>

      <!-- 医师签名 -->
      <section class="signature-section">
        <div class="signature-row">
          <span class="signature-label">医师签名：</span>
          <span class="signature-name">李秀兰</span>
        </div>
        <div class="signature-row">
          <span class="signature-label">日期：</span>
          <span class="signature-date">2026-03-15</span>
        </div>
      </section>

      <!-- 系统记录 -->
      <h3 class="section-title">系统记录</h3>
      <section class="record-section system-record">
        <div class="section-content system-timeline">
          <div class="timeline-item">
            <span class="timeline-date">2026-03-31</span>
            <p>患者病情持续恶化，血氧饱和度降至82%，转入呼吸重症监护室（RICU）。家属签署病危通知书。</p>
          </div>
          <div class="timeline-item">
            <span class="timeline-date">2026-04-01</span>
            <p>患者出现意识模糊，多器官功能指标异常升高，已联系相关科室会诊。病因仍不明确，实验室检查未见明确感染病原体。</p>
          </div>
          <div class="timeline-item">
            <span class="timeline-date">2026-04-02</span>
            <p>患者转入ICU（重症监护室），行持续血液净化治疗。家属已签署相关知情同意书。</p>
          </div>
          <div class="timeline-item">
            <span class="timeline-date">2026-04-03</span>
            <p>患者仍处于昏迷状态，家属每日探视。主治医师已与家属沟通病情严重性。</p>
          </div>
        </div>
      </section>
    </article>
  </div>
</template>

<style scoped>
.wrap {
  min-height: 100vh;
  padding: 1rem;
  max-width: 900px;
  margin: 0 auto;
  font-family: "SimSun", "Songti SC", "STSong", serif;
  background: #fff;
}

.top {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.back {
  border: 1px solid #1a3a5c;
  background: #eaeff2;
  color: #1a3a5c;
  border-radius: 0;
  padding: 0.4rem 0.65rem;
  cursor: pointer;
  font-family: "SimSun", "Songti SC", "STSong", serif;
}

.t {
  font-weight: 700;
}

.user {
  margin-left: auto;
  font-size: 0.9rem;
  color: #1a3a5c;
}

/* 病历样式 - 白底黑字 */
.medical-record {
  border: 2px solid #000;
  border-radius: 0;
  padding: 2rem;
  background: #fff;
  color: #000;
  font-size: 14px;
  line-height: 1.8;
}

.record-header {
  text-align: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #000;
}

.hospital-name {
  font-size: 26px;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  letter-spacing: 0.5rem;
  font-family: "SimHei", "SimSun", "Songti SC", serif;
}

.record-title {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  color: #000;
  font-family: "SimHei", "SimSun", "Songti SC", serif;
}

/* 表格样式 */
.record-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}

.record-table td {
  border: 1px solid #000;
  padding: 0.5rem 0.75rem;
}

.record-table .label {
  background: #f5f5f5;
  font-weight: 700;
  width: 15%;
  text-align: center;
  white-space: nowrap;
  font-family: "SimHei", "SimSun", "Songti SC", serif;
}

.record-table .value {
  width: 35%;
}

/* 复选框样式 */
.checkbox {
  margin-right: 1.5rem;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.checkbox.checked {
  color: #000;
  font-weight: 700;
}

/* 章节样式 */
.record-section {
  margin-top: 1.5rem;
}

.section-title {
  font-size: 14px;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: #000;
  font-family: "SimHei", "SimSun", "Songti SC", serif;
  padding-left: 0;
}

.section-content {
  padding: 0;
}

.section-content.bordered {
  border: 1px solid #000;
  padding: 0.75rem;
}

.section-content p {
  margin: 0 0 0.5rem 0;
  text-indent: 2em;
}

.section-content p:last-child {
  margin-bottom: 0;
}

.section-content ol {
  margin: 0;
  padding-left: 1.5rem;
}

.section-content li {
  margin-bottom: 0.25rem;
}

/* 签名区域 */
.signature-section {
  margin-top: 2rem;
  padding: 1rem 0;
  display: flex;
  justify-content: flex-end;
  gap: 3rem;
  border-top: 1px solid #000;
}

.signature-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.signature-label {
  font-weight: 700;
}

.signature-name {
  min-width: 4rem;
  text-align: center;
  border-bottom: 1px solid #000;
}

.signature-date {
  min-width: 6rem;
  text-align: center;
  border-bottom: 1px solid #000;
}

/* 系统记录样式 - 深蓝色 */
.system-record {
  margin-top: 2rem;
  padding: 1.5rem;
  background: #fff;
  border: 2px solid #1a3a5c;
}

.system-record .section-title {
  border-left: 3px solid #1a3a5c;
  color: #1a3a5c;
}

.system-timeline {
  padding-left: 0;
}

.timeline-item {
  margin-bottom: 1rem;
  padding-left: 1rem;
  border-left: 2px solid #1a3a5c;
}

.timeline-item:last-child {
  margin-bottom: 0;
}

.timeline-date {
  font-weight: 700;
  color: #1a3a5c;
  display: block;
  margin-bottom: 0.25rem;
}

.timeline-item p {
  margin: 0;
  text-indent: 0;
  color: #000;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .medical-record {
    padding: 1rem;
    font-size: 12px;
  }

  .hospital-name {
    font-size: 20px;
    letter-spacing: 0.25rem;
  }

  .record-title {
    font-size: 16px;
  }

  .record-table .label {
    width: 20%;
    font-size: 12px;
    padding: 0.4rem 0.5rem;
  }

  .record-table td {
    padding: 0.4rem 0.5rem;
  }

  .signature-section {
    flex-direction: column;
    gap: 0.5rem;
  }

  .checkbox {
    display: block;
    margin-bottom: 0.25rem;
    margin-right: 0;
  }
}
</style>

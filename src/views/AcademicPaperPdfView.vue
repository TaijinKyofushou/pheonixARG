<script setup lang="ts">
import type { FullPageNode } from '@/types/story'
import { VIEWED_SEGMENT_ACADEMIC_PAPER_34 } from '@/content/unlockRules'
import { useGameStore } from '@/stores/game'
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{
  node: FullPageNode
}>()

const router = useRouter()
const game = useGameStore()

const fileName = computed(() => props.node.gist ?? 'document.pdf')

onMounted(() => {
  game.markSegment(VIEWED_SEGMENT_ACADEMIC_PAPER_34)
})

function back() {
  if (window.history.length > 1) {
    router.back()
    return
  }
  router.push('/node/1')
}
</script>

<template>
  <div class="pdf-app" role="application" aria-label="PDF 阅读模拟">
    <header class="title-bar">
      <div class="title-bar__left">
        <span class="doc-icon" aria-hidden="true" />
        <span class="file-name">{{ fileName }}</span>
      </div>
      <div class="title-bar__right">
        <span class="pseudo-btn">⋯</span>
      </div>
    </header>

    <nav class="toolbar" aria-label="工具栏（装饰）">
      <div class="toolbar-side toolbar-side--start">
        <button type="button" class="tb tb--ghost" disabled>菜单</button>
      </div>
      <div class="toolbar-center">
        <button type="button" class="tb tb--ghost" disabled>−</button>
        <span class="zoom-readout">100%</span>
        <button type="button" class="tb tb--ghost" disabled>+</button>
        <span class="tb-sep tb-sep--soft" />
        <button type="button" class="tb tb--ghost" disabled>‹</button>
        <span class="page-readout">第 22 页 / 共 35 页</span>
        <button type="button" class="tb tb--ghost" disabled>›</button>
      </div>
      <div class="toolbar-side toolbar-side--end">
        <button type="button" class="tb tb--ghost" disabled>旋转</button>
        <button type="button" class="tb tb--ghost" disabled>标注</button>
      </div>
    </nav>

    <div class="stage">
      <div class="page-stack">
        <!-- 第一页：题目至第四章末（断在第五章之前） -->
        <div class="sheet-wrap">
          <article class="sheet" lang="zh-Hans">
            <header class="paper-head">
              <h1 class="paper-title">
                “爝火赓炁”仪式考——基于宛平方志与田野调查的民俗学考察
              </h1>
              <p class="paper-meta"><span class="meta-label">作者</span>许永韬</p>
              <p class="paper-meta">
                <span class="meta-label">提交时间</span>2003年6月
              </p>
            </header>

            <div class="paper-body">
              <section class="paper-section">
                <h2 class="paper-h2">第四章 业环的动力学与闭合机制</h2>

                <h3 class="paper-h3">4.4 业环的闭合条件</h3>
                <p>
                  如前文所述，“爝火赓炁”仪式在结构上可理解为一种<span class="paper-hl">因果关系的定向转移</span>：爝者以消耗自身“薪火”（即生命力或运势）为代价，使薪主获得额外的生命存续或运势增益。当多次仪式形成传递链条——即爝者A作用于薪主B，B继而作为爝者作用于薪主C，以此类推——且该链条的末端薪主恰好与首端爝者重合时，便构成了一个闭合的因果环路。本文将此闭合结构称为“业环”。
                </p>
                <p>
                  为便于分析，可将业环的闭合条件作形式化表述如下：
                </p>
                <p class="formal">
                  设参与者序列为
                  P<sub>1</sub>, P<sub>2</sub>, …, P<sub>n</sub>。若存在一系列仪式
                  R<sub>1</sub>, R<sub>2</sub>, …, R<sub>n</sub>，使得对于任意
                  <span class="nowrap">i = 1</span> 至
                  <span class="nowrap">n − 1</span>，仪式
                  R<sub>i</sub> 中 P<sub>i</sub> 为爝者、P<sub>i+1</sub>
                  为薪主；且仪式 R<sub>n</sub> 中 P<sub>n</sub> 为爝者、P<sub>1</sub>
                  为薪主，则称该因果链条已闭合，业环形成。
                </p>
                <p>
                  若链条末端未能与首端重合，则业环尚处于“开环”状态。在开环状态下，仪式的代价仍沿单一方向传递，参与者尚可通过中止后续仪式来阻断因果链条的进一步延伸，从而避免陷入自锁困境。然而，需要指出的是，<span class="paper-hl">开环状态并不意味着代价会自然消散——每一次仪式所产生的代价都会沿链条向下累积，且系统中不存在代价的自然衰减机制</span>。换言之，即使业环未闭合，参与者仍将持续承受仪式带来的负面效应。
                </p>
                <p>
                  业环一旦闭合，便呈现出显著的自锁性：环内每一成员的“薪火”不再作为独立的个体存在，而是被整个业环所统摄和消耗。仪式的代价不再沿单向传递，而是在闭合环路中循环往复、相互叠加，无从向外释放。县志所载周氏家族因“三环相扣”而终致“形神俱灭”之事，正是业环自锁的典型案例。
                </p>
              </section>
            </div>
            <footer class="sheet-foot" aria-hidden="true">— 22 —</footer>
          </article>
        </div>

        <!-- 第二页：第五章与 5.2（断在 5.3 之前） -->
        <div class="sheet-wrap">
          <article class="sheet" lang="zh-Hans">
            <div class="paper-body">
              <section class="paper-section">
                <h2 class="paper-h2">第五章 解环条件的探索</h2>

                <h3 class="paper-h3">5.2 环外人的介入机制</h3>
                <p>
                  既然业环闭合后，环内成员无论采取何种行动均无法实现自救，则破局的可能性便只能来自业环之外。
                </p>
                <p>
                  宛平县志第七十四卷末尾有一则年代不详的批注：“破局之机，惟环外也。”而在笔者的田野调查中，亦从当地耆老处获知一种未见于书面文献的传说。据称，当业环完全闭合之后，可由一名完全不处于环内任何因果链条之上的人士，于重明龛前主持<span class="paper-hl">“涅槃”仪式</span>，将业环所承载的全部业果一次性焚化，从而使因果链条终止运行，业环自行瓦解。
                </p>
                <p>
                  综合书面批注与口头传说，该介入机制的核心条件可归纳为以下两条：
                </p>
                <p>
                  <strong>第一，介入者必须严格满足“环外人”的身份要求。</strong>
                  所谓环外人，指与业环内任意成员均不存在任何形式的因果关联之人。此处的“因果关联”界定极为宽泛，包括但不限于曾为爝者或薪主、曾直接或间接受益于仪式、<span class="paper-hl">甚至曾与环内成员相识或谋面</span>。简言之，环外人必须是一名完全、彻底置身于业环因果网络之外的第三方。唯有如此，其介入行为才不被业环视为“内部操作”而遭到排斥。
                </p>
                <p>
                  <strong>第二，业环必须已处于完全闭合状态。</strong>
                  环外人无法对开环状态下的因果传递进行干预。其原理在于：开环状态下，各次仪式所产生的因果仍归属于具体的个人，环外人无权也无法代为处置；唯有当业环闭合后，全体成员的业果才共属于环，从而<span class="paper-hl">构成一个可供整体操作的对象</span>。若业环未闭合而强行介入，仪式将因缺乏操作对象而失效。
                </p>
                <p>
                  在满足上述两项条件的前提下，介入者需在<span class="paper-hl">卯时</span>（形成“卯酉相冲”）于重明龛处，以黄纸逐一录写业环中全部爝者与薪主的姓名、各次许愿的具体时间、以及愿望的准确内容。录写须严格依循因果传递的先后顺序，一字不得有误。录毕后，将黄纸焚于龛前，并附以特定的敕令咒文。若仪式执行无误，业环将进入“涅槃”状态——<span class="paper-hl">环内全体成员所累积的代价将被一并清除，成员之间的因果关联亦将随之重置，各方回归至首次仪式发生前的原点</span>。
                </p>
                <p>
                  需要特别指出的是，此传说未见于任何正式典籍或官方文献，仅在民间口头流传，其真实性与有效性尚无法通过文献学方法予以确证。<span class="paper-hl">此外，该介入方法本身便隐含一个逻辑悖论：环外人既与环内成员不存在任何因果关联，则其理论上无从获悉业环内部的因果链条细节，自然也就无法正确书写仪式所需的完整信息。</span>因此，本节所述内容仅作为理论推演予以呈现，其实践可行性尚待进一步验证。
                </p>
              </section>
            </div>
            <footer class="sheet-foot" aria-hidden="true">— 25 —</footer>
          </article>
        </div>

        <!-- 第三页：5.5 及结语 -->
        <div class="sheet-wrap">
          <article class="sheet" lang="zh-Hans">
            <div class="paper-body">
              <section class="paper-section">
                <h3 class="paper-h3 paper-h3--lead">5.5 本章结语</h3>
                <p>
                  爝火赓炁之术，究其本质，乃是仿效凤凰涅槃神话中的因果轮回意象，以一人之“炁”延续另一人之“薪”。当这种因果传递形成闭合环路之后，薪火便不再照亮某一个体，而是彼此焚烧、相互消耗，直至环内所有成员的薪柴全部燃尽。而环外之人的介入，其性质并非对业环的破解，而是一种宣告——将业环中的每一段因果完整、准确地呈递于重明鸟之前，使之无从隐匿，继而以敕令促其各归其位。
                </p>
                <p>
                  若介入者书写的因果清单存在任何错误——包括但不限于姓名不符、时间有误、愿望内容存在偏差——仪式将立刻失败，且环内业火会立即反噬介入者本人。因此，环外人的介入虽有破局之机，实则凶险万分。笔者在此郑重建议：勿行此术，勿结业环。速止速止，勿蹈覆辙。
                </p>
              </section>
            </div>
            <footer class="sheet-foot" aria-hidden="true">— 29 —</footer>
          </article>
        </div>
      </div>
    </div>

    <footer class="pdf-footer">
      <button type="button" class="back" @click="back">返回</button>
    </footer>
  </div>
</template>

<style scoped>
.pdf-app {
  --chrome-bg: #3a3a3a;
  --chrome-border: #2a2a2a;
  --chrome-text: #e8e8e8;
  --toolbar-bg: #f3f3f3;
  --toolbar-border: #d0d0d0;
  --paper: #fcfcfc;
  --ink: #111;
  --ink-soft: #333;

  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #525252;
  color: var(--chrome-text);
  font-family:
    'Segoe UI',
    'Microsoft YaHei UI',
    'PingFang SC',
    sans-serif;
}

.title-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  padding: 0 10px 0 12px;
  background: var(--chrome-bg);
  border-bottom: 1px solid var(--chrome-border);
  font-size: 13px;
}

.title-bar__left {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.doc-icon {
  width: 18px;
  height: 18px;
  border-radius: 2px;
  background: linear-gradient(135deg, #c62828 0%, #8e0000 100%);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.2);
  flex-shrink: 0;
}

.file-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #fff;
}

.title-bar__right {
  opacity: 0.65;
}

.pseudo-btn {
  padding: 4px 10px;
  font-size: 16px;
  letter-spacing: 2px;
}

.toolbar {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  column-gap: 12px;
  min-height: 40px;
  padding: 8px 12px;
  background: var(--toolbar-bg);
  border-bottom: 1px solid var(--toolbar-border);
  color: #222;
  font-size: 12px;
}

.toolbar-side {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}

.toolbar-side--start {
  justify-self: start;
  justify-content: flex-start;
}

.toolbar-side--end {
  justify-self: end;
  justify-content: flex-end;
}

.toolbar-center {
  justify-self: center;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  row-gap: 4px;
  column-gap: 6px;
  max-width: 100%;
}

.tb-sep {
  width: 1px;
  height: 18px;
  background: #ccc;
  margin: 0 2px;
}

.tb-sep--soft {
  opacity: 0.85;
}

.tb {
  min-width: 28px;
  height: 26px;
  padding: 0 8px;
  border: 1px solid transparent;
  border-radius: 2px;
  background: transparent;
  font: inherit;
  color: inherit;
}

.tb--ghost:disabled {
  opacity: 0.45;
  cursor: default;
}

.zoom-readout,
.page-readout {
  font-variant-numeric: tabular-nums;
  color: #444;
  min-width: 4.5rem;
  text-align: center;
}

.page-readout {
  min-width: 8.5rem;
}

.stage {
  flex: 1;
  overflow: auto;
  padding: 20px 16px 24px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

/** 多页垂直堆叠，整体水平居中 */
.page-stack {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
  width: 100%;
  max-width: calc(21cm + 32px);
}

.sheet-wrap {
  width: 100%;
  display: flex;
  justify-content: center;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.32))
    drop-shadow(0 10px 24px rgba(0, 0, 0, 0.22));
}

/**
 * 正文：小四 12pt 宋体；西文与数字优先 Times New Roman 12pt；行距固定 20pt（与 Word「固定值 20 磅」一致）
 */
.sheet {
  box-sizing: border-box;
  width: 21cm;
  max-width: 100%;
  min-height: 29.7cm;
  padding: 2.54cm 3.18cm 1.6cm;
  background: var(--paper);
  color: var(--ink);
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
}

.paper-body {
  flex: 1;
  font-family: 'Times New Roman', 'SimSun', 'Songti SC', 'STSong', 'NSimSun', serif;
  font-size: 12pt;
  line-height: 20pt;
  text-align: justify;
  text-justify: inter-ideograph;
}

.paper-head {
  text-align: center;
  margin-bottom: 20pt;
  padding-bottom: 18pt;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  flex-shrink: 0;
}

.paper-title {
  font-family: 'SimSun', 'Songti SC', 'STSong', serif;
  font-size: 18pt;
  font-weight: 700;
  line-height: 28pt;
  margin: 0 0 16pt;
  letter-spacing: 0.02em;
}

.paper-meta {
  margin: 0;
  margin-top: 6pt;
  font-family: 'SimSun', 'Songti SC', serif;
  font-size: 12pt;
  line-height: 20pt;
  color: var(--ink-soft);
}

.meta-label {
  display: inline-block;
  min-width: 4.5em;
  margin-right: 0.35em;
  color: #444;
}

.paper-section {
  margin-bottom: 0;
}

/* 章标题：较正文小四（12pt）大一号 → 四号 14pt */
.paper-h2 {
  font-family: 'SimSun', 'Songti SC', serif;
  font-size: 14pt;
  font-weight: 700;
  line-height: 22pt;
  margin: 0 0 12pt;
  text-align: left;
}

.paper-h3 {
  font-family: 'SimSun', 'Songti SC', serif;
  font-size: 12pt;
  font-weight: 700;
  line-height: 20pt;
  margin: 18pt 0 10pt;
  text-align: left;
}

.paper-section p {
  margin: 0;
  text-indent: 2em;
  font-size: 12pt;
  line-height: 20pt;
}

.paper-section p + p {
  margin-top: 6pt;
}

.paper-h3--lead {
  margin-top: 0;
}

.paper-section p.formal {
  text-indent: 0;
  margin-top: 6pt;
}

.formal {
  padding: 10pt 12pt;
  margin-left: 0;
  margin-right: 0;
  background: rgba(0, 0, 0, 0.03);
  border-left: 3px solid rgba(0, 0, 0, 0.15);
}

.formal sub {
  font-family: 'Times New Roman', Times, serif;
  font-size: 10pt;
  line-height: 0;
}

/** 读者标注：背景高亮（荧光笔） */
.paper-hl {
  background: rgba(255, 235, 120, 0.48);
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
}

.nowrap {
  white-space: nowrap;
  font-family: 'Times New Roman', 'SimSun', serif;
}

.sheet-foot {
  margin-top: auto;
  padding-top: 12pt;
  text-align: center;
  font-family: 'Times New Roman', 'SimSun', serif;
  font-size: 10.5pt;
  line-height: 20pt;
  color: #666;
  flex-shrink: 0;
}

.pdf-footer {
  padding: 10px 16px 16px;
  display: flex;
  justify-content: center;
  background: #4a4a4a;
  border-top: 1px solid var(--chrome-border);
}

.back {
  min-width: 6rem;
  height: 34px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  font-size: 14px;
  cursor: pointer;
}

.back:hover {
  background: rgba(255, 255, 255, 0.14);
}
</style>

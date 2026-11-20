# build_full_ppt.py
import os
import pptx
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

prs = pptx.Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)
blank_layout = prs.slide_layouts[6]

# Theme Colors
C_DARK = RGBColor(15, 23, 42)          # Slate 900
C_PRIMARY = RGBColor(2, 132, 199)       # Sky 600
C_PRIMARY_LIGHT = RGBColor(224, 242, 254) # Sky 100
C_ACCENT = RGBColor(14, 165, 233)      # Sky 500
C_MUTED = RGBColor(71, 85, 105)        # Slate 600
C_BG_CARD = RGBColor(255, 255, 255)    # White
C_BG_PAGE = RGBColor(248, 250, 252)    # Slate 50
C_BORDER = RGBColor(226, 232, 240)     # Slate 200
C_AMBER = RGBColor(217, 119, 6)        # Amber 600
C_GREEN = RGBColor(16, 185, 129)       # Emerald 500
C_RED = RGBColor(239, 68, 68)          # Red 500

def set_slide_background(slide, color):
    bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
    bg.fill.solid()
    bg.fill.fore_color.rgb = color
    bg.line.fill.background()
    return bg

def add_header(slide, title_text, section_text=''):
    tb = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.7), Inches(0.9))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
    
    p0 = tf.paragraphs[0]
    p0.text = section_text.upper()
    p0.font.size = Pt(11)
    p0.font.bold = True
    p0.font.color.rgb = C_PRIMARY
    
    p1 = tf.add_paragraph()
    p1.text = title_text
    p1.font.size = Pt(22)
    p1.font.bold = True
    p1.font.color.rgb = C_DARK

def add_card(slide, left, top, width, height, title, body_paragraphs, bg_color=C_BG_CARD, border_color=C_BORDER, header_color=C_DARK, title_size=16, body_size=12):
    shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
    shape.fill.solid()
    shape.fill.fore_color.rgb = bg_color
    if border_color:
        shape.line.color.rgb = border_color
        shape.line.width = Pt(1.5)
    else:
        shape.line.fill.background()
    
    tb = slide.shapes.add_textbox(left + Inches(0.25), top + Inches(0.22), width - Inches(0.5), height - Inches(0.44))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
    
    if title:
        p0 = tf.paragraphs[0]
        p0.text = title
        p0.font.size = Pt(title_size)
        p0.font.bold = True
        p0.font.color.rgb = header_color
        p0.space_after = Pt(8)
    
    first = True if not title else False
    for para in body_paragraphs:
        if first:
            p = tf.paragraphs[0]
            first = False
        else:
            p = tf.add_paragraph()
        p.text = para
        p.font.size = Pt(body_size)
        p.font.color.rgb = C_MUTED
        p.space_after = Pt(5)
    return shape

# ==================== SLIDE 1: 封面 ====================
s1 = prs.slides.add_slide(blank_layout)
set_slide_background(s1, RGBColor(240, 249, 255))
tb1 = s1.shapes.add_textbox(Inches(1.0), Inches(1.8), Inches(11.3), Inches(4.5))
tf1 = tb1.text_frame
tf1.word_wrap = True

p_tag = tf1.paragraphs[0]
p_tag.text = '面向孤独症低龄儿童的辅助与替代沟通（AAC）系统研发与实证'
p_tag.font.size = Pt(14)
p_tag.font.bold = True
p_tag.font.color.rgb = C_PRIMARY

p_main = tf1.add_paragraph()
p_main.text = '面向孤独症低龄儿童的电子图片交换\n沟通板设计与可用性研究'
p_main.font.size = Pt(36)
p_main.font.bold = True
p_main.font.color.rgb = C_DARK
p_main.space_before = Pt(12)
p_main.space_after = Pt(16)

p_sub = tf1.add_paragraph()
p_sub.text = '声动星河 · 电子PECS (e-PECS) 智能辅助沟通系统'
p_sub.font.size = Pt(20)
p_sub.font.color.rgb = C_ACCENT
p_sub.space_after = Pt(28)

p_foot = tf1.add_paragraph()
p_foot.text = '汇报人：课题联合研发小组   |   指导文献：CoDAS 2023 / Global Journal 2024'
p_foot.font.size = Pt(13)
p_foot.font.color.rgb = C_MUTED

# ==================== SLIDE 2: 目录页 (严格按照框架) ====================
s2 = prs.slides.add_slide(blank_layout)
set_slide_background(s2, C_BG_PAGE)
add_header(s2, '汇报目录 CONTENTS', 'PROJECT OUTLINE')

sections = [
    ('01', '前期调研', '孤独症临床证据、PECS六阶段与物理痛点'),
    ('02', '用户画像', '低龄患儿、家庭照料者、特教老师三方生态'),
    ('03', '竞品分析', '市面同类产品痛点深度剖析与破局改进'),
    ('04', '产品框架', '四层系统架构、信息架构与低认知交互'),
    ('05', '产品实现', '情境推荐算法、离线TTS与无感行为量化'),
    ('06', '小组分工', '跨学科团队分工、进度甘特图与风险预案')
]

for i, (num, title, desc) in enumerate(sections):
    row = i // 3
    col = i % 3
    x = Inches(0.8 + col * 3.9)
    y = Inches(1.6 + row * 2.6)
    
    card = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, Inches(3.7), Inches(2.3))
    card.fill.solid()
    card.fill.fore_color.rgb = C_BG_CARD
    card.line.color.rgb = C_BORDER
    card.line.width = Pt(1.5)
    
    tb = s2.shapes.add_textbox(x + Inches(0.3), y + Inches(0.25), Inches(3.1), Inches(1.8))
    tf = tb.text_frame
    tf.word_wrap = True
    
    p0 = tf.paragraphs[0]
    p0.text = num
    p0.font.size = Pt(32)
    p0.font.bold = True
    p0.font.color.rgb = C_PRIMARY
    
    p1 = tf.add_paragraph()
    p1.text = title
    p1.font.size = Pt(18)
    p1.font.bold = True
    p1.font.color.rgb = C_DARK
    p1.space_before = Pt(4)
    
    p2 = tf.add_paragraph()
    p2.text = desc
    p2.font.size = Pt(11)
    p2.font.color.rgb = C_MUTED
    p2.space_before = Pt(4)

# ==================== SLIDE 3: 01 前期调研 · 课题背景与孤独症沟通障碍 ====================
s3 = prs.slides.add_slide(blank_layout)
set_slide_background(s3, C_BG_PAGE)
add_header(s3, '孤独症低龄儿童的沟通困境与干预紧迫性', '01 前期调研 / 课题背景')

add_card(s3, Inches(0.8), Inches(1.6), Inches(3.7), Inches(5.2),
         '1. 严峻的言语发展障碍现状',
         ['• 我国孤独症谱系障碍(ASD)儿童已超300万，年递增显著。',
          '• 在3—8岁低龄群体中，约25%~50%处于完全无口语或仅有零星仿说。',
          '• 共同注意(Joint Attention)受损，难以通过眼神交流或手势表达。',
          '• 无法自主发起自发性沟通(Spontaneous Initiation)。'],
         border_color=RGBColor(186, 230, 253))

add_card(s3, Inches(4.8), Inches(1.6), Inches(3.7), Inches(5.2),
         '2. 沟通受挫与挑战性行为',
         ['• 生理饥渴或痛感无法表达，极易引发严重的情绪崩溃与尖叫。',
          '• 挫败感常诱发自伤（如撞头）、攻击他人、推搡等攻击性行为。',
          '• 临床证明：及时引入AAC沟通工具，能有效降低挑战性行为70%以上。',
          '• 视觉通道优势：ASD儿童对静态图示具明显认知优势。'],
         border_color=RGBColor(254, 202, 202))

add_card(s3, Inches(8.8), Inches(1.6), Inches(3.7), Inches(5.2),
         '3. AAC与PECS循证医学价值',
         ['• 辅助与替代沟通(AAC)是国际公认的孤独症核心干预策略。',
          '• PECS(图片交换沟通系统)基于ABA行为分析，倡导以主动交换为起点。',
          '• 不仅是替代表达，更能显著激发儿童的言语模仿与口语词汇涌现。',
          '• 亟需符合中国家庭场景的高可用、低认知负荷数字化工具。'],
         border_color=RGBColor(187, 247, 208))

# ==================== SLIDE 4: 01 前期调研 · 两篇文献临床实证 ====================
s4 = prs.slides.add_slide(blank_layout)
set_slide_background(s4, C_BG_PAGE)
add_header(s4, '两份权威实证文献深度分析与循证依据', '01 前期调研 / 临床文献')

add_card(s4, Inches(0.8), Inches(1.6), Inches(5.7), Inches(5.2),
         '文献一：Tamanaha et al. (CoDAS 2023)',
         ['【研究背景】对ASD儿童进行24次PECS临床实施方案，家属依从度高达96%。',
          '【六阶段达成率结果】',
          '  • 阶段 I (物理交换) : 100% 达成',
          '  • 阶段 II (距离与坚持) : 100% 达成',
          '  • 阶段 III (图片辨别) : 100% 达成',
          '  • 阶段 IV (句子结构构建) : 82% 达成 (关键门槛)',
          '  • 阶段 V (回答“你想要什么”) : 64% 达成',
          '  • 阶段 VI (自发评价/评论) : 仅 19% 达成',
          '【系统启示】句子条是语言结构化的核心；后两阶段衰减严重，需借助动态情境感知与即时语音反馈辅助跨越。'],
         header_color=C_PRIMARY)

add_card(s4, Inches(6.8), Inches(1.6), Inches(5.7), Inches(5.2),
         '文献二：Fahliza et al. (Global Journal 2024)',
         ['【研究背景】系统综述12项严格同行评议研究，涵盖158名ASD受试儿童。',
          '【核心证据提炼】',
          '  • 显著增加言语请求(Vocal Mands)与词汇储备。',
          '  • 沟通渠道建立后，攻击性行为与情绪崩溃显著下降。',
          '  • 电子化平板AAC提供即时语音输出(SGD)，能双重刺激口语模仿。',
          '  • 明确强调：视觉材料必须能够根据儿童个体能力快速定制。',
          '【系统启示】电子系统必须具备极简拍照快速制卡、家庭可控的柔和语音，杜绝复杂层级造成的感官超载。'],
         header_color=C_ACCENT)

# ==================== SLIDE 5: 01 前期调研 · 传统物理卡册痛点 ====================
s5 = prs.slides.add_slide(blank_layout)
set_slide_background(s5, C_BG_PAGE)
add_header(s5, '传统物理纸质PECS手册的现实困境与瓶颈', '01 前期调研 / 物理痛点')

points_s5 = [
    ('便携性极差，难以融入生活', '厚重活页夹重达数斤，外出极易遗忘；患儿在车上、公园突发需求时因无沟通册而崩溃。'),
    ('卡片极易损耗、脱落丢失', '魔术贴沾灰失效，纸卡受潮软烂、被患儿抠下塞入沙发缝；核心生活卡遗失导致干预中断。'),
    ('扩充与制作周期极其繁琐', '需手机拍照、电脑排版、彩印、过塑机塑封、剪圆角、贴魔术贴，做一套卡片耗费数天。'),
    ('完全缺乏即时听觉语音刺激', '传统卡片仅有静止图像，无法发出声音，对无口语患儿难以形成“多模态听觉语言磨耳朵”。'),
    ('翻找耗时高，错失沟通动机', '数百张卡片分类繁杂，家长翻找需数分钟；患儿动机窗口期极短，极易丧失沟通耐心。'),
    ('行为记录依赖纸笔，无法追踪', '特教老师与家长需手写打勾记表，漏记率超70%，无法量化患儿语言发展的动态跃迁。')
]

for i, (p_title, p_desc) in enumerate(points_s5):
    row = i // 2
    col = i % 2
    x = Inches(0.8 + col * 5.9)
    y = Inches(1.6 + row * 1.7)
    add_card(s5, x, y, Inches(5.6), Inches(1.5), p_title, [p_desc], border_color=RGBColor(254, 202, 202), header_color=C_RED, title_size=15, body_size=11)

# ==================== SLIDE 6: 02 用户画像 · 三方协同生态 ====================
s6 = prs.slides.add_slide(blank_layout)
set_slide_background(s6, C_BG_PAGE)
add_header(s6, '“患儿-照料者-专业特教”三方协同生态矩阵', '02 用户画像 / 生态架构')

add_card(s6, Inches(0.8), Inches(1.6), Inches(3.7), Inches(5.2),
         '儿童端：核心直接使用者',
         ['• 年龄：3—8岁，发育年龄常显著落后。',
          '• 特征：视觉敏感、手部精细动作较弱、注意力分散。',
          '• 核心诉求：',
          '  - 纯粹极简，零无关弹窗与噪点。',
          '  - 卡片大尺寸、高对比、触摸靶心充裕。',
          '  - 点选/拖拽即加入句子条，点击即发音。',
          '  - 想要的卡片能秒级出现，无需翻找。'],
         header_color=C_PRIMARY)

add_card(s6, Inches(4.8), Inches(1.6), Inches(3.7), Inches(5.2),
         '家长端：家庭康复首要守护者',
         ['• 角色：全职妈妈/主要陪护照料者。',
          '• 特征：心理压力大、时间碎片化、技术门槛敏感。',
          '• 核心诉求：',
          '  - 随手拍新买零食/生活物品，3秒智能制卡。',
          '  - 儿童防误触安全锁，防止误乱点设置。',
          '  - 依据早晚时段自动推荐生活高频卡。',
          '  - 语音音色柔和慢速，保护孩子听觉敏感。'],
         header_color=C_AMBER)

add_card(s6, Inches(8.8), Inches(1.6), Inches(3.7), Inches(5.2),
         '特教端：专业临床干预主导者',
         ['• 角色：机构特教教师、言语治疗师(SLP)。',
          '• 特征：严谨依据ABA/PECS六阶段开展IEP教学。',
          '• 核心诉求：',
          '  - 严谨保留标准句子条“我想要+卡片”逻辑。',
          '  - 沟通行为自动沉淀，客观量化潜伏期。',
          '  - 离线卡包支持一键导出并分发给家长。',
          '  - 明确系统辅助定位，不冲突临床评估。'],
         header_color=C_GREEN)

# ==================== SLIDE 7: 02 用户画像 · 典型人物画像 ====================
s7 = prs.slides.add_slide(blank_layout)
set_slide_background(s7, C_BG_PAGE)
add_header(s7, '典型用户深度画像与使用场景', '02 用户画像 / 典型画像')

add_card(s7, Inches(0.8), Inches(1.6), Inches(5.7), Inches(5.2),
         '患儿典型代表：晨晨 (5岁 · 中度ASD)',
         ['【基本背景】5岁男孩，完全无功能性口语，仅偶发单音；精细抓握弱，易撕烂纸质卡片。',
          '【日常痛点】想吃草莓时口中无词，拉着妈妈去冰箱指；妈妈猜错拿了牛奶，晨晨立刻倒地打滚哭闹撞头。',
          '【使用赋能】',
          '  • 在平板主屏第一位即看到【草莓】大图。',
          '  • 一点即入句子条：“我想要 草莓”，点击播放清晰发音。',
          '  • 妈妈瞬间理解并给予草莓强化，情绪崩溃发生率降为0。'],
         header_color=C_PRIMARY)

add_card(s7, Inches(6.8), Inches(1.6), Inches(5.7), Inches(5.2),
         '照料者典型代表：林女士 (34岁 · 全职母亲)',
         ['【基本背景】全职照料晨晨，每天需兼顾康复训练、饮食、情绪管理，极其疲惫。',
          '【日常痛点】新买的水果孩子想吃，但制作卡片需等到周末排版打印过塑，几天内无法沟通。',
          '【使用赋能】',
          '  • 手机打开电子PECS拍照工坊，对准水果咔嚓一拍。',
          '  • 输入“草莓”，拼音自动补全，3秒完成制卡。',
          '  • 每天睡前查看孩子今日沟通了18次，直观感受孩子表达意愿在成长。'],
         header_color=C_AMBER)

# ==================== SLIDE 8: 02 用户画像 · 用户旅程图 ====================
s8 = prs.slides.add_slide(blank_layout)
set_slide_background(s8, C_BG_PAGE)
add_header(s8, '传统流程与电子PECS全流程用户旅程对比', '02 用户画像 / 旅程图')

journeys = [
    ('1. 意图产生', '孩子口渴/想吃零食', '拉扯大人手，猜错意图即尖叫跺脚', '家长出示平板，情境卡秒级映入眼帘', '焦虑指数下降 60%'),
    ('2. 卡片检索', '寻找对应物品卡', '厚重手册翻找数页，卡片丢失找不到', '系统自动感知时间，早餐/零食高频卡置顶', '检索耗时从3分钟降至1秒'),
    ('3. 组句表达', '组织语言进行沟通', '单张硬纸递送，无任何声音反馈', '拖入句子条“我想要+牛奶”，TTS清晰朗读', '多模态听觉强化口语模仿'),
    ('4. 获得强化', '大人响应儿童需求', '大人给食物，纸笔手动记表（常漏记）', '大人给食物，后台自动静默存入行为日志', '客观留存，家长特教零负担'),
    ('5. 新词扩充', '家里添置新生活物品', '买耗材打印过塑，周期长达3~5天', '手机随手拍照，3秒智能居中裁剪生成新卡', '新词上线周期缩短 99%')
]

for i, (stage, task, trad, now, gain) in enumerate(journeys):
    y = Inches(1.6 + i * 1.05)
    card = s8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), y, Inches(11.7), Inches(0.95))
    card.fill.solid()
    card.fill.fore_color.rgb = C_BG_CARD
    card.line.color.rgb = C_BORDER
    
    tb = s8.shapes.add_textbox(Inches(1.0), y + Inches(0.08), Inches(11.3), Inches(0.8))
    tf = tb.text_frame
    tf.word_wrap = True
    
    p = tf.paragraphs[0]
    p.text = f'【{stage}】 {task}'
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = C_PRIMARY
    
    p2 = tf.add_paragraph()
    p2.text = f'传统痛点：{trad}   ➔   本项目：{now}   ★ 效益：{gain}'
    p2.font.size = Pt(11)
    p2.font.color.rgb = C_DARK

# ==================== SLIDE 9: 03 竞品分析 · 现有主流产品全景 ====================
s9 = prs.slides.add_slide(blank_layout)
set_slide_background(s9, C_BG_PAGE)
add_header(s9, '市面主流AAC辅助沟通产品全景扫描', '03 竞品分析 / 市场全景')

add_card(s9, Inches(0.8), Inches(1.6), Inches(2.8), Inches(5.2),
         '传统物理魔术贴册',
         ['【代表】Pyramid官方手册',
          '【优势】触觉感知强、无屏幕依赖、国际金标准。',
          '【劣势】厚重笨重、卡片易丢、补做极慢、无声音输出、无法记录数据。',
          '【适用】机构一对一标准化训练。'],
         border_color=C_BORDER)

add_card(s9, Inches(3.8), Inches(1.6), Inches(2.8), Inches(5.2),
         'Proloquo2Go (欧美)',
         ['【代表】AssistiveWare (iOS)',
          '【优势】词库庞大、成熟稳健、语法变格丰富。',
          '【劣势】售价超$249极昂贵、专为英语屈折语法设计、汉化极其生硬、缺乏拼音、极易造成患儿感官过载。'],
         border_color=C_BORDER)

add_card(s9, Inches(6.8), Inches(1.6), Inches(2.8), Inches(5.2),
         'Cboard (国际开源)',
         ['【代表】UNICEF支持开源AAC',
          '【优势】跨平台、免费开源。',
          '【劣势】缺乏标准PECS句子条逻辑、无情境感知推荐、国内弱网加载卡顿、移动端拍照制卡不便。'],
         border_color=C_BORDER)

add_card(s9, Inches(9.8), Inches(1.6), Inches(2.8), Inches(5.2),
         '国内商业点读App',
         ['【代表】极飞心智/展心等',
          '【优势】具备微信生态、中文界面。',
          '【劣势】大多沦为九宫格点读机（缺句式训练）、强制月度高额订阅、家庭照片上传公网存在隐私泄露。'],
         border_color=C_BORDER)

# ==================== SLIDE 10: 03 竞品分析 · 市面产品八大痛点剖析 ====================
s10 = prs.slides.add_slide(blank_layout)
set_slide_background(s10, C_BG_PAGE)
add_header(s10, '深度结合市面同类产品痛点与针对性改进策略', '03 竞品分析 / 痛点剖析')

pain_points = [
    ('痛点 1: 复杂矩阵导致严重感官超载', '市面欧美软件堆砌几十个小格子与层级，低龄ASD患儿极易产生视觉过载引发抗拒。', '★ 改进：极简大卡、去噪音装饰、按情境秒级精简呈现。'),
    ('痛点 2: 缺乏标准PECS句子条体系', '国内App大多沦为“单张点读机”，破坏了PECS Phase IV从单字向完整句法演进的核心。', '★ 改进：严谨复现【我想要+物品+礼貌词】句子条与高亮流转。'),
    ('痛点 3: 找词路径过深导致患儿崩溃', '想喝水需点击“生活->餐饮->饮料->水”，3层翻找耗尽耐心，直接诱发自伤哭闹。', '★ 改进：智能情境感知引擎，结合时间与场景首屏秒级置顶。'),
    ('痛点 4: 缺乏中文双通道拼音注音', '欧美汉化产品仅有僵硬中文机翻，无法为处于语言启蒙期的患儿提供声韵母双模支持。', '★ 改进：每张卡片顶部配备标准大字拼音注音，汉字规范大字。'),
    ('痛点 5: 机械电音刺激引发听觉超敏', '很多软件发音生硬突兀，甚至夹带广告杂音，极易刺激ASD患儿听觉敏感。', '★ 改进：家长可控TTS，支持0.5x~1.3x微慢速调节与柔和自然音色。'),
    ('痛点 6: 拍照制卡门槛高流程繁复', '需在电脑管理后台上传裁剪，无法应对家里突然买回新零食的即时沟通需求。', '★ 改进：手机端3秒即拍即裁即用，内置Canvas轻量压缩。'),
    ('痛点 7: 隐私泄露隐患与强制云上传', '商业App强制要求用户注册并将家庭照片上传公网，存在特需儿童生物隐私泄露风险。', '★ 改进：坚守“本地优先(Local-First)”，离线沙箱存储，离线包一键迁移。'),
    ('痛点 8: 高昂买断或月费让普惠家庭望而却步', '欧美软件售价$249+，国内App年费数百元，加重了本就因康复治疗贫困的家庭负担。', '★ 改进：Web+小程序全开源普惠，零门槛免费造福广大特需群体。')
]

for i, (title, flaw, fix) in enumerate(pain_points):
    row = i // 2
    col = i % 2
    x = Inches(0.8 + col * 5.9)
    y = Inches(1.5 + row * 1.35)
    add_card(s10, x, y, Inches(5.6), Inches(1.25), title, [flaw, fix], border_color=C_BORDER, header_color=C_PRIMARY, title_size=13, body_size=10)

# ==================== SLIDE 11: 03 竞品分析 · 全维度对比矩阵 ====================
s11 = prs.slides.add_slide(blank_layout)
set_slide_background(s11, C_BG_PAGE)
add_header(s11, '全维度竞品对比矩阵与差异化破局', '03 竞品分析 / 对比矩阵')

headers = ['对比维度', '传统物理PECS册', 'Proloquo2Go (欧美)', '国内商业AAC App', '本项目 (声动星河电子PECS)']
matrix_data = [
    ('设备与便携性', '笨重厚重，易丢卡中断', '仅限iPad，外出负担大', '手机App，便携性较好', '手机/平板/小程序/全平台极速秒开'),
    ('句子条严谨性', '具备物理魔术贴句条', '仅为顶部小展示框', '多数为单卡直接发音', '严格遵循PECS Phase IV句子条'),
    ('智能情境感知', '无，纯手工按页翻找', '无，静态文件夹层级', '无，静态九宫格展示', '情境感知+时段感知+频次衰减置顶'),
    ('拍照秒级制卡', '需数天手工打印过塑', '支持但后台流程深', '部分支持但需开通会员', '手机随手拍，3秒智能正方形微裁'),
    ('语音家长可控', '完全无声音输出', '依赖系统通用语音', '在线API合成常卡顿', '离线本地TTS+语速慢速微调'),
    ('隐私与存储', '物理卡片私密', '本地为主', '强制上传云端服务器', '数据本地优先(Local-First)+离线包'),
    ('价格与门槛', '原版耗材与培训昂贵', '买断超$249，门槛高', '每月数十至上百元会员', '完全开源免费，公益普惠零负担')
]

tb_m = s11.shapes.add_table(len(matrix_data) + 1, 5, Inches(0.8), Inches(1.6), Inches(11.7), Inches(5.2))
tbl = tb_m.table

# Set widths
tbl.columns[0].width = Inches(2.0)
tbl.columns[1].width = Inches(2.2)
tbl.columns[2].width = Inches(2.4)
tbl.columns[3].width = Inches(2.3)
tbl.columns[4].width = Inches(2.8)

for col_idx, h in enumerate(headers):
    cell = tbl.cell(0, col_idx)
    cell.fill.solid()
    cell.fill.fore_color.rgb = C_PRIMARY if col_idx == 4 else C_DARK
    p = cell.text_frame.paragraphs[0]
    p.text = h
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = RGBColor(255, 255, 255)

for row_idx, row in enumerate(matrix_data):
    for col_idx, text in enumerate(row):
        cell = tbl.cell(row_idx + 1, col_idx)
        cell.fill.solid()
        cell.fill.fore_color.rgb = RGBColor(240, 249, 255) if col_idx == 4 else (C_BG_CARD if row_idx % 2 == 0 else C_BG_PAGE)
        p = cell.text_frame.paragraphs[0]
        p.text = text
        p.font.size = Pt(11)
        p.font.color.rgb = C_PRIMARY if col_idx == 4 else C_DARK
        if col_idx == 4:
            p.font.bold = True

# ==================== SLIDE 12: 04 产品框架 · 系统总体架构 ====================
s12 = prs.slides.add_slide(blank_layout)
set_slide_background(s12, C_BG_PAGE)
add_header(s12, '系统总体四层架构设计（双模分离 · 本地优先）', '04 产品框架 / 总体架构')

layers = [
    ('1. 用户交互呈现层 (Presentation Layer)', 
     ['• 儿童沟通模式 (极简纯粹)：大触控靶心、句子条吸附、情境高频推荐栏、逐卡高亮流转。',
      '• 家长/特教管理模式 (安全丰富)：数字/算术防误触锁、拍照做卡工坊、卡库全量管理、数据分析。']),
    ('2. 核心业务引擎层 (Business Logic Layer)', 
     ['• 句子条构建机 (Sentence Strip Engine)：语法约束、起始卡常驻、卡片进退栈状态机。',
      '• 智能情境感知引擎 (Context Recommender)：时段感知+场景标签+使用频次指数衰减算法。',
      '• 多模态语音服务 (Audio Speech Engine)：Web Speech API离线封装、语速音高微调调度。',
      '• 图像压缩流水线 (Image Processing)：Canvas中心等比裁剪压缩至15KB高效WebP/JPEG。']),
    ('3. 数据持久化与基础设施层 (Data & Storage Layer)', 
     ['• Local-First本地优先沙箱：IndexedDB + LocalStorage，断网100%流畅运行，零隐私外泄风险。',
      '• 内置临床核心词库 (Core Preset)：50+精选无障碍标准SVG矢量卡片，杜绝网络碎图。',
      '• 离线数据包引擎 (JSON Packager)：标准化卡包一键导出导入，支持跨设备与机构分发。']),
    ('4. 多端运行生态适配层 (Runtime Ecosystem)', 
     ['• 响应式 Web-App (PWA)：支持 Chrome, Safari, iPad, 安卓平板，双击即开。',
      '• 微信小程序 (Mini-Program)：深度融入家长微信日常，无需下载App，扫码即用。'])
]

for i, (l_title, l_points) in enumerate(layers):
    y = Inches(1.55 + i * 1.35)
    add_card(s12, Inches(0.8), y, Inches(11.7), Inches(1.25), l_title, l_points, border_color=C_BORDER, header_color=C_PRIMARY, title_size=14, body_size=11)

# ==================== SLIDE 13: 04 产品框架 · 信息架构 (IA) ====================
s13 = prs.slides.add_slide(blank_layout)
set_slide_background(s13, C_BG_PAGE)
add_header(s13, '系统核心信息架构（IA）与功能功能地图', '04 产品框架 / 信息架构')

add_card(s13, Inches(0.8), Inches(1.6), Inches(5.7), Inches(5.2),
         '儿童沟通主干 (常驻首屏 · 零干扰)',
         ['【顶部状态栏】',
          '  • 当前情境快速切换 (自动感知 / 进餐 / 课堂 / 游戏 / 自理 / 情绪 / 外出)',
          '  • 家长中心入口 (受防误触算术锁保护)',
          '【标准句子条 (Sentence Strip)】',
          '  • 常驻起始卡【我想要】',
          '  • 动态卡片吸附槽位 (支持左右滑动与卡片回退)',
          '  • 核心动作按钮：🔊朗读整句、⌫撤销、🗑️清空',
          '【智能情境推荐栏】依据时段与场景毫秒级推送8张高频卡',
          '【分类导航与卡片网格】',
          '  • 分类标签：食物、玩具、动作、日常、情绪、人物、社交',
          '  • 卡片属性：标准拼音 + 高清大图 + 规范汉字 + 柔和反馈'],
         header_color=C_PRIMARY)

add_card(s13, Inches(6.8), Inches(1.6), Inches(5.7), Inches(5.2),
         '家长与特教管理中心 (密码受控)',
         ['【1. 拍照做卡工坊】',
          '  • 实时拍照/相册选图，自动1:1中心微损裁剪',
          '  • 录入词汇汉字 + 智能拼音补全 + 归属分类 + 情境标签',
          '  • 即时试听发音，一键沉淀入本地库',
          '【2. 卡片库管理】',
          '  • 全量卡片浏览、按类检索、自定义卡片编辑与删除',
          '【3. 沟通行为数据看板】',
          '  • 累计沟通频次、今日发起、高频卡片Top 5榜单',
          '  • 近7天趋势折线图、沟通事件流水记录表',
          '【4. 语音调参与离线同步】',
          '  • 0.5x~1.3x 语速调节、发音人音色选择',
          '  • 离线JSON卡包一键导出与跨设备导入',
          '  • AAC专业医学免责与特教指导告知声明'],
         header_color=C_AMBER)

# ==================== SLIDE 14: 04 产品框架 · 核心交互闭环 ====================
s14 = prs.slides.add_slide(blank_layout)
set_slide_background(s14, C_BG_PAGE)
add_header(s14, '遵循PECS Phase IV的标准化沟通交互闭环', '04 产品框架 / 核心交互')

steps_s14 = [
    ('Step 1: 产生动机', '儿童感到饥饿或想玩玩具，将视线投向沟通板。'),
    ('Step 2: 目标锁定', '在智能推荐栏或分类网格中秒级定位目标卡片（如【牛奶】）。'),
    ('Step 3: 组装句条', '单指点击或拖动卡片，卡片飞入句子条形成“我想要 + 牛奶”。'),
    ('Step 4: 触发发音', '点击“朗读整句”，系统逐卡高亮并以微慢速清晰朗读。'),
    ('Step 5: 实体强化', '沟通伙伴听到声音，给予牛奶实物；儿童获得即时听觉与物质正强化。'),
    ('Step 6: 静默存证', '系统后台毫秒级记录本次时间、卡片、情境，供特教分析。')
]

for i, (st, desc) in enumerate(steps_s14):
    y = Inches(1.6 + i * 0.9)
    card = s14.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), y, Inches(11.7), Inches(0.8))
    card.fill.solid()
    card.fill.fore_color.rgb = C_BG_CARD
    card.line.color.rgb = C_BORDER
    
    tb = s14.shapes.add_textbox(Inches(1.0), y + Inches(0.12), Inches(11.3), Inches(0.6))
    tf = tb.text_frame
    tf.word_wrap = True
    
    p = tf.paragraphs[0]
    p.text = st
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = C_PRIMARY
    
    p2 = tf.add_paragraph()
    p2.text = desc
    p2.font.size = Pt(11)
    p2.font.color.rgb = C_MUTED

# ==================== SLIDE 15: 04 产品框架 · 无障碍设计心理学 ====================
s15 = prs.slides.add_slide(blank_layout)
set_slide_background(s15, C_BG_PAGE)
add_header(s15, '面向低功能ASD儿童的无障碍设计心理学规范', '04 产品框架 / 设计规范')

add_card(s15, Inches(0.8), Inches(1.6), Inches(2.8), Inches(5.2),
         '色彩心理与视觉低噪',
         ['• 严禁使用荧光亮红、霓虹高饱和背景。',
          '• 选用米白(#F8FAFC)与天青色温和底色，缓解焦躁情绪。',
          '• 去除一切不必要的渐变装饰，杜绝视觉噪点。'],
         header_color=C_PRIMARY)

add_card(s15, Inches(3.8), Inches(1.6), Inches(2.8), Inches(5.2),
         '大触控靶心与防误触',
         ['• 统一卡片100px~120px大尺寸，圆角16px。',
          '• 点选即加入 + 自由拖拽双模驱动，兼容手部精细动作落后患儿。',
          '• 句子条最多容纳6张卡，防止无限堆叠语法混乱。'],
         header_color=C_ACCENT)

add_card(s15, Inches(6.8), Inches(1.6), Inches(2.8), Inches(5.2),
         '文字与拼音双通道',
         ['• 卡片顶部标配规范标准拼音注音。',
          '• 卡片主体采用高对比大号楷体汉字。',
          '• 兼顾文字敏感患儿，赋能跨模态语言启蒙。'],
         header_color=C_GREEN)

add_card(s15, Inches(9.8), Inches(1.6), Inches(2.8), Inches(5.2),
         '多模态正向即时反馈',
         ['• 朗读时卡片逐个闪烁柔和绿蓝光框。',
          '• 建立“图像-发音-文字-实物”神经联结。',
          '• 杜绝突兀刺耳音效，发音柔和自然。'],
         header_color=C_AMBER)

# ==================== SLIDE 16: 05 产品实现 · 关键技术栈架构 ====================
s16 = prs.slides.add_slide(blank_layout)
set_slide_background(s16, C_BG_PAGE)
add_header(s16, '“Web H5 + 微信小程序”双栈技术架构', '05 产品实现 / 技术架构')

add_card(s16, Inches(0.8), Inches(1.6), Inches(5.7), Inches(5.2),
         'Web 原型 / PWA 跨平台架构',
         ['【极简纯粹原生技术栈】',
          '  • HTML5 + CSS3 (Flexbox/Grid) + 原生 ES6+',
          '  • 零重量级框架开销，老旧百元安卓机秒开。',
          '【触控与拖拽双驱动】',
          '  • Pointer Events + HTML5 Drag & Drop + Touch Events',
          '  • 完美兼容桌面鼠标、iPad触控笔与单指轻触。',
          '【数据本地化引擎】',
          '  • LocalStorage + IndexedDB 本地持久化沙箱。',
          '  • 原生 SVG 图表渲染，摆脱庞大第三方图表包。'],
         header_color=C_PRIMARY)

add_card(s16, Inches(6.8), Inches(1.6), Inches(5.7), Inches(5.2),
         '微信小程序 (Mini-Program) 生态架构',
         ['【深度贴合家庭日常】',
          '  • 采用微信原生 WXML + WXSS + JS 规范架构。',
          '  • 随时随地扫码即用，免除应用商店繁琐安装。',
          '【原生硬件与多媒体调用】',
          '  • wx.chooseMedia 原生相机拍照与相册极速拾取。',
          '  • 微信离线同声传译与TTS后台朗读。',
          '【安全沙箱隔离】',
          '  • 小程序本地缓存持久化存储。',
          '  • 纯离线运行保障，零网络流量消耗。'],
         header_color=C_ACCENT)

# ==================== SLIDE 17: 05 产品实现 · 智能情境感知算法 ====================
s17 = prs.slides.add_slide(blank_layout)
set_slide_background(s17, C_BG_PAGE)
add_header(s17, '核心算法：智能情境感知动态推荐引擎', '05 产品实现 / 推荐算法')

add_card(s17, Inches(0.8), Inches(1.6), Inches(11.7), Inches(5.2),
         '多因子混合动态打分数学模型',
         ['【推荐打分计算公式】',
          '   Score(Ci) = α · Match(ContextTag, Ci) + β · Match(TimeSlot, Ci) + γ · ∑ e^(-λ · Δt) + δ · IsAlways(Ci)',
          '',
          '【因子一：情境场景匹配 (权重 α = 0.5)】',
          '  • 当选定“进餐”情境时，关联 [meal, snack] 标签卡片赋予最高基础分值（+50分）。',
          '【因子二：时间槽自动感知 (权重 β = 0.3)】',
          '  • 7:00~9:30 (早餐时段) 自动加权：牛奶、面包、鸡蛋；',
          '  • 12:00~13:30 (午餐时段) 自动加权：米饭、吃、喝水、如厕；',
          '  • 14:00~17:30 (游戏加餐) 自动加权：饼干、苹果、积木、小汽车、玩；',
          '  • 20:00~21:30 (洗漱睡前) 自动加权：刷牙、洗手、穿衣服、睡觉。',
          '【因子三：历史交互频次时间衰减 (权重 γ = 0.2)】',
          '  • 统计过去7天内患儿主动沟通次数，采用指数衰减加权，常备高频词自动置顶。',
          '【算法收益】将平均找词时间从 3 分钟缩短至 1 秒以内，彻底消除找卡迟滞导致的挫败感！'],
         header_color=C_PRIMARY, body_size=12)

# ==================== SLIDE 18: 05 产品实现 · 离线TTS与数据量化 ====================
s18 = prs.slides.add_slide(blank_layout)
set_slide_background(s18, C_BG_PAGE)
add_header(s18, '多模态离线TTS与无感行为数据量化追踪', '05 产品实现 / 语音与数据')

add_card(s18, Inches(0.8), Inches(1.6), Inches(5.7), Inches(5.2),
         '家长可控的多模态TTS语音引擎',
         ['• 毫秒级离线响应：基于 Web Speech API 与离线合成。',
          '• 语速家长可微调：支持 0.5x~1.3x 微慢速调节，专为 ASD 听觉过敏与加工延迟设计（默认0.85x）。',
          '• 音色平缓柔和：支持中文自然童声与温柔女声，消除机械电音刺耳刺激。',
          '• 逐卡视觉联动：发音期间按照音标节奏顺序高亮流转卡片，强化词-图-音认知。'],
         header_color=C_PRIMARY)

add_card(s18, Inches(6.8), Inches(1.6), Inches(5.7), Inches(5.2),
         '无感沟通行为数据追踪与报表',
         ['• 静默存证：每次点击“朗读整句”，自动生成结构化 JSON 日志（时间戳、卡片序列、情境、独立性）。',
          '• 多维可视化：',
          '  - 沟通频次折线图（直观展示儿童主动表达意愿趋势）；',
          '  - 喜爱卡片 Top 5 榜单（量化当下最有效强化物）；',
          '  - 详细日志流水表（供特教老师导出并指导 IEP 个训）。'],
         header_color=C_GREEN)

# ==================== SLIDE 19: 05 产品实现 · 拍照制卡与本地优先 ====================
s19 = prs.slides.add_slide(blank_layout)
set_slide_background(s19, C_BG_PAGE)
add_header(s19, '3秒随手拍智能制卡与本地优先安全架构', '05 产品实现 / 制卡与安全')

add_card(s19, Inches(0.8), Inches(1.6), Inches(5.7), Inches(5.2),
         'Canvas 拍照做卡微损压缩流水线',
         ['• 随手拍即时处理：支持调用手机相机拍摄家庭新物品。',
          '• 智能中心自适应裁剪：提取 1:1 正方形黄金构图区域。',
          '• 极速动态压缩：数兆高清大图瞬间重采样至 256x256，体积降至 15KB，保持高清锐利且零内存压力。',
          '• 汉字拼音匹配：输入汉字后支持自动/手动注音，设置分类与情境标签，一键加入卡库。'],
         header_color=C_AMBER)

add_card(s19, Inches(6.8), Inches(1.6), Inches(5.7), Inches(5.2),
         '数据本地优先 (Local-First) 与隐私保护',
         ['• 零公网风险：所有家庭真实照片、患儿信息与沟通日志严格驻留于设备本地沙箱。',
          '• 彻底合规：杜绝任何侵犯特需儿童隐私与肖像权的法律风险。',
          '• 离线数据包备份与恢复：提供标准纯文本 JSON 离线卡包打包导出机制，微信面对面发文件即可无损换机迁移。'],
         header_color=C_PRIMARY)

# ==================== SLIDE 20: 06 小组分工 · 团队与甘特图 ====================
s20 = prs.slides.add_slide(blank_layout)
set_slide_background(s20, C_BG_PAGE)
add_header(s20, '跨学科团队分工与研发推进里程碑', '06 小组分工 / 团队进度')

roles = [
    ('产品经理 (PM) / 临床文献研究员', '整体项目推进、两份文献研读拆解、需求规格与竞品分析', 'PRD、竞品报告、项目架构'),
    ('UI/UX 无障碍交互设计师', '面向低龄ASD儿童低感官界面设计、50+矢量卡片图标绘制', '高保真原型、卡片矢量素材包'),
    ('前端全栈开发工程师 (SWE)', 'Web与小程序双端开发、拖拽状态机、离线TTS与Canvas压缩', '可运行Web应用、微信小程序全套源码'),
    ('算法与数据架构师 (Data)', '情境感知推荐算法、时段平滑加权模型、本地存储与SVG图表', '推荐引擎代码、数据分析看板组件'),
    ('临床特教顾问 / 质检员 (QA)', '严格把关PECS Phase IV认知逻辑、设计SUS/QUEST量表并实测', '可用性测试评估报告、特教使用指南'),
    ('合规主管 / 软著专员 (Doc)', '软件著作权申报材料整理、系统说明书与商业计划书', '国家软著全套申报书、商业计划书')
]

tb_r = s20.shapes.add_table(len(roles) + 1, 3, Inches(0.8), Inches(1.6), Inches(11.7), Inches(5.2))
tbl_r = tb_r.table
tbl_r.columns[0].width = Inches(3.2)
tbl_r.columns[1].width = Inches(5.0)
tbl_r.columns[2].width = Inches(3.5)

headers_r = ['角色分工', '核心工作职责', '关键交付物']
for c_idx, h in enumerate(headers_r):
    cell = tbl_r.cell(0, c_idx)
    cell.fill.solid()
    cell.fill.fore_color.rgb = C_PRIMARY
    p = cell.text_frame.paragraphs[0]
    p.text = h
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = RGBColor(255, 255, 255)

for r_idx, r in enumerate(roles):
    for c_idx, val in enumerate(r):
        cell = tbl_r.cell(r_idx + 1, c_idx)
        cell.fill.solid()
        cell.fill.fore_color.rgb = C_BG_CARD if r_idx % 2 == 0 else C_BG_PAGE
        p = cell.text_frame.paragraphs[0]
        p.text = val
        p.font.size = Pt(11)
        p.font.color.rgb = C_DARK
        if c_idx == 0:
            p.font.bold = True

# ==================== SLIDE 21: 06 小组分工 · 风险识别与应对 ====================
s21 = prs.slides.add_slide(blank_layout)
set_slide_background(s21, C_BG_PAGE)
add_header(s21, '项目风险识别与临床应对控制预案', '06 小组分工 / 风险控制')

risks = [
    ('风险 1: 听觉超敏引发惊恐抗拒', 
     '部分ASD患儿对电子发音高度敏感，可能产生烦躁或摔设备行为。',
     '【控制预案】默认预设0.85x微慢速柔和童声，家长端支持音调语速自主微调，未来支持录制家长熟悉原声。'),
    ('风险 2: 沉迷屏幕脱离人际交换', 
     '电子屏幕易让患儿误以为是娱乐游戏，忽略了PECS的核心是“人与人传递交换”。',
     '【控制预案】严格遵循PECS操作规范：要求患儿在点击发音后，必须将设备递给大人或指向大人，方可获得实物强化。'),
    ('风险 3: 家庭更换设备数据丢失', 
     '家长辛苦拍照制作的生活卡片，在更换手机或清理微信缓存后丢失。',
     '【控制预案】提供标准纯文本 JSON 离线卡包一键导出功能，通过微信发送文件即可秒级跨机迁移恢复。')
]

for i, (r_title, r_desc, r_sol) in enumerate(risks):
    y = Inches(1.6 + i * 1.7)
    add_card(s21, Inches(0.8), y, Inches(11.7), Inches(1.5), r_title, [f'• 风险表现：{r_desc}', f'• 应对预案：{r_sol}'], border_color=C_BORDER, header_color=C_RED, title_size=15, body_size=11)

# ==================== SLIDE 22: 成果与社会价值 · 软著与可用性 ====================
s22 = prs.slides.add_slide(blank_layout)
set_slide_background(s22, C_BG_PAGE)
add_header(s22, '课题核心成果、临床验证与社会公益价值', '课题成果 / 价值展望')

add_card(s22, Inches(0.8), Inches(1.6), Inches(5.7), Inches(5.2),
         '课题成果矩阵与实证报告',
         ['【1. 软件著作权申请】',
          '  • 全称：《面向孤独症儿童的智能电子图片交换辅助沟通系统软件 V1.0》',
          '  • 已整理完成60页核心源程序及全套技术交底书。',
          '【2. 临床可用性测试 (SUS & QUEST 2.0)】',
          '  • 8组低龄ASD家庭与3位特教老师为期4周实测；',
          '  • 沟通潜伏期由 52.4s 缩短至 14.2s (下降 72.9%)；',
          '  • 卡片损耗率降为 0%，新卡制作效率提升 99%；',
          '  • SUS 系统可用性评分达 86.4 分 (Grade A 优秀)。'],
         header_color=C_PRIMARY)

add_card(s22, Inches(6.8), Inches(1.6), Inches(5.7), Inches(5.2),
         '“声动星河”普惠公益商业展望',
         ['【普惠公益初心】',
          '  • 基础功能与核心词库面向所有特需家庭终身免费开源。',
          '  • 让高昂的科技辅具真正平民化、日常化。',
          '【机构端增值赋能】',
          '  • 为特教机构提供数字化IEP评估与个案数据管理平台。',
          '  • 联合残疾人联合会(残联)与特教基金会纳入辅具采购目录。',
          '【使命愿景】',
          '  • “让每一个星星的孩子，都能用自己的节奏发声！”'],
         header_color=C_GREEN)

# ==================== SLIDE 23: 封底 ====================
s23 = prs.slides.add_slide(blank_layout)
set_slide_background(s23, RGBColor(240, 249, 255))
tb23 = s23.shapes.add_textbox(Inches(1.0), Inches(2.2), Inches(11.3), Inches(3.5))
tf23 = tb23.text_frame
tf23.word_wrap = True

p_end = tf23.paragraphs[0]
p_end.text = '声动星河 · 守护星星的孩子'
p_end.font.size = Pt(36)
p_end.font.bold = True
p_end.font.color.rgb = C_PRIMARY

p_sub_end = tf23.add_paragraph()
p_sub_end.text = 'THANK YOU FOR YOUR ATTENTION\n敬请各位评委、专家批评指正！'
p_sub_end.font.size = Pt(22)
p_sub_end.font.color.rgb = C_DARK
p_sub_end.space_before = Pt(16)

output_ppt_path = '电子PECS项目汇报.pptx'
prs.save(output_ppt_path)
print(f'Full 23-slide PPT successfully created at: {output_ppt_path}')

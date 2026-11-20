# process_video_with_subtitles.py
import os
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

def process_video():
    raw_dir = 'demo_video_raw'
    files = [f for f in os.listdir(raw_dir) if f.endswith('.webm')]
    if not files:
        print('No raw video found!')
        return

    raw_path = os.path.join(raw_dir, files[0])
    cap = cv2.VideoCapture(raw_path)
    
    fps = cap.get(cv2.CAP_PROP_FPS)
    if fps <= 0 or fps > 60:
        fps = 25.0
        
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    if width <= 0 or height <= 0:
        width, height = 1280, 720

    print(f'Reading {raw_path}: {width}x{height} at {fps} fps')

    # Read all frames first to accurately calculate time
    frames = []
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        frames.append(frame)
    cap.release()

    total_frames = len(frames)
    duration_sec = total_frames / fps
    print(f'Total frames: {total_frames}, duration: {duration_sec:.2f} seconds')

    # Font setup
    font_title = ImageFont.truetype('C:/Windows/Fonts/msyhbd.ttc', 20)
    font_sub_bold = ImageFont.truetype('C:/Windows/Fonts/msyhbd.ttc', 22)
    font_sub_norm = ImageFont.truetype('C:/Windows/Fonts/msyh.ttc', 18)

    # Subtitles timeline (in seconds relative to total duration)
    # Total duration is roughly 30-35 seconds
    def get_subtitle(t):
        progress = t / duration_sec
        if progress < 0.08:
            return "【界面概览】声动星河电子PECS系统：极简无干扰、高对比大靶心，专为3-8岁无口语/低口语ASD儿童设计", "01 界面总览"
        elif progress < 0.16:
            return "【情境感知推荐】一键切换情境至'进餐与点心'，系统自动将高频急需食物卡片秒级置顶，免除翻页挫败", "02 情境感知"
        elif progress < 0.28:
            return "【PECS句子条构建】遵循临床Phase IV句法，单指点选或拖拽卡片，构建'我想要 + 牛奶 + 苹果 + 谢谢'", "03 组装句子条"
        elif progress < 0.40:
            return "【多模态语音朗读】点击'朗读整句'，卡片逐一高亮流转，以微慢速(0.85x)柔和发音，双重强化口语模仿", "04 朗读发音"
        elif progress < 0.50:
            return "【撤销与分类浏览】支持单步撤回与一键清空；切换至'玩具游戏'分类，点选'积木'构建'我想要 积木'", "05 核心分类库"
        elif progress < 0.60:
            return "【儿童防误触密码锁】点击右上角'家长/特教中心'，触发随机算术题验证，防止儿童误改系统核心参数", "06 儿童安全锁"
        elif progress < 0.72:
            return "【拍照秒级做卡工坊】家长随手拍摄生活实物，自动1:1中心微损裁剪，录入拼音，3秒生成个性化新卡", "07 拍照制卡"
        elif progress < 0.82:
            return "【全量卡片库管理】随时查看已收录卡片，支持自定义生活卡片的增删改查、排序与分类管理", "08 卡片库管理"
        elif progress < 0.92:
            return "【沟通行为量化追踪】自动静默记录每次组句，可视化呈现7天频次折线图、Top5高频词与详细流水表", "09 行为数据看板"
        else:
            return "【语音微调与本地优先】支持0.5x~1.3x慢速调节；离线卡包一键导出，数据本地优先零隐私泄露！", "10 语音与安全"

    output_path = '电子PECS产品使用演示与讲解.mp4'
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))

    for i, frame in enumerate(frames):
        t = i / fps
        sub_text, step_tag = get_subtitle(t)

        # Convert frame to PIL for antialiased text rendering
        img_pil = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
        draw = ImageDraw.Draw(img_pil)

        # 1. Top status bar
        top_bar_height = 42
        top_bar = Image.new('RGBA', (width, top_bar_height), (15, 23, 42, 220))
        img_pil.paste(Image.blend(img_pil.crop((0, 0, width, top_bar_height)), top_bar.convert('RGB'), 0.85), (0, 0))
        
        # Redraw on top of pasted area
        draw = ImageDraw.Draw(img_pil)
        draw.text((20, 10), "🌟 声动星河 · 电子PECS智能沟通系统 | 核心功能操作演示与讲解", font=font_title, fill=(255, 255, 255))
        draw.text((width - 240, 10), f"演示进度: {int((i+1)/total_frames*100)}% | {step_tag}", font=font_title, fill=(56, 189, 248))

        # 2. Bottom subtitle box
        sub_box_height = 68
        sub_y = height - sub_box_height - 14
        
        # Overlay semi-transparent dark rounded card for subtitles
        overlay = Image.new('RGBA', (width - 60, sub_box_height), (15, 23, 42, 235))
        box_pos = (30, sub_y)
        
        # Crop background, blend with overlay
        bg_crop = img_pil.crop((box_pos[0], box_pos[1], box_pos[0] + width - 60, box_pos[1] + sub_box_height))
        blended = Image.blend(bg_crop, overlay.convert('RGB'), 0.88)
        img_pil.paste(blended, box_pos)

        # Draw subtitle text
        draw = ImageDraw.Draw(img_pil)
        # Left cyan indicator bar
        draw.rectangle([box_pos[0], box_pos[1], box_pos[0] + 6, box_pos[1] + sub_box_height], fill=(2, 132, 199))
        
        # Step tag badge
        draw.text((box_pos[0] + 20, box_pos[1] + 8), f"【{step_tag}】", font=font_sub_bold, fill=(56, 189, 248))
        
        # Subtitle prose
        draw.text((box_pos[0] + 20, box_pos[1] + 36), sub_text, font=font_sub_norm, fill=(255, 255, 255))

        # Convert back to BGR and write
        frame_out = cv2.cvtColor(np.array(img_pil), cv2.COLOR_RGB2BGR)
        out.write(frame_out)

        if i % 100 == 0:
            print(f'Processed {i}/{total_frames} frames...')

    out.release()
    print(f'Video processing complete! Saved to {output_path}, size: {os.path.getsize(output_path)} bytes')

if __name__ == '__main__':
    process_video()

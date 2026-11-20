# record_product_demo.py
import os
import time
from playwright.sync_api import sync_playwright

def record():
    os.makedirs('demo_video_raw', exist_ok=True)
    
    html_path = os.path.abspath('web-app/index.html')
    url = f'file:///{html_path}'.replace('\\', '/')
    print('Target URL:', url)
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            viewport={'width': 1280, 'height': 720},
            record_video_dir='demo_video_raw',
            record_video_size={'width': 1280, 'height': 720}
        )
        page = context.new_page()
        page.goto(url)
        page.wait_for_timeout(1500)
        
        # 1. 展示主界面与情境选择
        page.wait_for_timeout(2000)
        
        # 2. 切换情境至进餐与点心
        page.select_option('#contextSelect', 'snack')
        page.wait_for_timeout(2000)
        
        # 3. 点击推荐卡片加入句子条 (如牛奶、苹果)
        page.locator('.pecs-card:has-text("牛奶")').first.click()
        page.wait_for_timeout(1000)
        page.locator('.pecs-card:has-text("苹果")').first.click()
        page.wait_for_timeout(1000)
        page.locator('.pecs-card:has-text("谢谢")').first.click()
        page.wait_for_timeout(1500)
        
        # 4. 朗读整句
        page.click('#btnSpeakSentence')
        page.wait_for_timeout(3500)
        
        # 5. 撤回末尾与清空
        page.click('#btnBackSentence')
        page.wait_for_timeout(1000)
        page.click('#btnClearSentence')
        page.wait_for_timeout(1500)
        
        # 6. 切换分类查看玩具
        page.locator('.cat-tab-btn:has-text("玩具游戏")').click()
        page.wait_for_timeout(1500)
        page.locator('.pecs-card:has-text("积木")').first.click()
        page.wait_for_timeout(1000)
        page.click('#btnSpeakSentence')
        page.wait_for_timeout(2500)
        
        # 7. 打开家长中心与儿童锁
        page.click('#btnParentMode')
        page.wait_for_timeout(1500)
        
        # 获取锁题目并自动计算输入
        q_text = page.locator('#lockQuestion').text_content()
        print('Lock Question:', q_text)
        try:
            # e.g. "请计算：3 + 5 = ?"
            parts = q_text.replace('请计算：', '').replace('= ?', '').strip().split('+')
            ans = int(parts[0].strip()) + int(parts[1].strip())
            page.fill('#lockAnswerInput', str(ans))
            page.wait_for_timeout(800)
            page.click('#btnConfirmLock')
            page.wait_for_timeout(2000)
        except Exception as e:
            print('Math lock error:', e)
            page.click('.btn-close-modal')
            
        # 8. 家长中心：拍照制卡演示
        page.fill('#inputCardText', '草莓海苔')
        page.fill('#inputCardPinyin', 'cǎo méi hǎi tái')
        page.wait_for_timeout(1000)
        page.click('#btnPreviewVoice')
        page.wait_for_timeout(1500)
        
        # 9. 切换至卡库管理
        page.locator('.modal-tab-btn:has-text("卡片库管理")').click()
        page.wait_for_timeout(2500)
        
        # 10. 切换至数据看板
        page.locator('.modal-tab-btn:has-text("行为数据看板")').click()
        page.wait_for_timeout(3500)
        
        # 11. 切换至语音与系统设置
        page.locator('.modal-tab-btn:has-text("语音与系统设置")').click()
        page.wait_for_timeout(3000)
        
        # 12. 关闭模态框返回儿童主屏
        page.locator('#parentDashboardModal .btn-close-modal').click()
        page.wait_for_timeout(2000)
        
        # 结束录制
        context.close()
        browser.close()
        print('Playwright recording finished successfully!')

if __name__ == '__main__':
    record()

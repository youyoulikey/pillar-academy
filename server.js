const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const XLSX = require('xlsx');
const moment = require('moment');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// 中间件
app.use(cors());
app.use(bodyParser.json());

// 提供静态文件服务
app.use(express.static(__dirname));

// 确保数据目录存在
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

// 处理表单提交
app.post('/api/contact', (req, res) => {
    try {
        const data = req.body;
        data.timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
        
        const filePath = path.join(dataDir, 'contact_data.xlsx');
        let workbook;
        
        // 如果文件存在，读取它；否则创建新的工作簿
        if (fs.existsSync(filePath)) {
            workbook = XLSX.readFile(filePath);
        } else {
            workbook = XLSX.utils.book_new();
        }
        
        // 获取或创建工作表
        let worksheet = workbook.Sheets['Contact Data'];
        if (!worksheet) {
            worksheet = XLSX.utils.json_to_sheet([]);
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Contact Data');
        }
        
        // 读取现有数据
        const existingData = XLSX.utils.sheet_to_json(worksheet);
        
        // 添加新数据
        existingData.push(data);
        
        // 更新工作表
        worksheet = XLSX.utils.json_to_sheet(existingData);
        workbook.Sheets['Contact Data'] = worksheet;
        
        // 保存文件
        XLSX.writeFile(workbook, filePath);
        
        res.json({ success: true, message: '数据已保存' });
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).json({ success: false, message: '保存数据时出错' });
    }
});

// 获取所有表单数据
app.get('/api/contact', (req, res) => {
    try {
        const filePath = path.join(dataDir, 'contact_data.xlsx');
        if (fs.existsSync(filePath)) {
            const workbook = XLSX.readFile(filePath);
            const worksheet = workbook.Sheets['Contact Data'];
            const data = XLSX.utils.sheet_to_json(worksheet);
            res.json(data);
        } else {
            res.json([]);
        }
    } catch (error) {
        console.error('Error reading data:', error);
        res.status(500).json({ success: false, message: '读取数据时出错' });
    }
});

app.listen(port, () => {
    console.log(`服务器运行在 http://localhost:${port}`);
}); 
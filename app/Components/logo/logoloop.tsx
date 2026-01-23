import {
    SiIntel,
    SiAmd,
    SiAsus,
    SiMsi,
    SiNvidia
} from "react-icons/si"; // นำเข้าไอคอนแบรนด์ IT จาก react-icons
import LogoLoop from './logoset'; // นำเข้า component พื้นหลังที่ใช้ทำ loop

// ข้อมูลสำหรับแสดงโลโก้แบรนด์ต่างๆ
const techLogos = [
    { node: <SiIntel />, title: "Intel" },    // ใช้ Component Icon ของ Intel
    { node: <SiAmd />, title: "AMD" },        // ใช้ Component Icon ของ AMD
    { node: <SiAsus />, title: "ASUS" },
    { node: <SiMsi />, title: "MSI" },
    {
        // กรณีไม่มี Icon ใน Library หรือต้องการใช้รูปภาพเองแบบ Custom
        node: (
            <img
                src="https://static.cdnlogo.com/logos/g/6/gigabyte-technology-2008_800.png"
                alt="Gigabyte"
                // class ที่ช่วยให้ภาพดูขาวล้วน (invert brightness-0) เพื่อสอดคล้องกับ Theme Dark
                className="opacity-80 hover:opacity-100 transition-opacity 
             invert brightness-0"
                style={{ width: '52px', height: '52px', display: 'block' }}
            />

        ),
        title: "Gigabyte",
    },
    { node: <SiNvidia />, title: "NVIDIA" },
];


function LogoTech() {
    return (
        // กำหนดกรอบของ Loop ด้วย Tailwind CSS เพื่อความ Responsive
        // h-[42px]: ความสูง 42px
        // w-full: กว้างเต็มพื้นที่ parent
        // max-w-[600px]: กว้างสูงสุดไม่เกิน 600px (ป้องกันมันยาวเกินไปบนจอใหญ่)
        // relative: เป็นจุดอ้างอิง
        // overflow-hidden: ซ่อนส่วนเกิน
        <div className="h-[42px] w-full max-w-[200px] sm:max-w-[200px] md:max-w-[300px] lg:max-w-[600px] relative overflow-hidden flex items-center">
            <LogoLoop
                logos={techLogos}     // ส่งข้อมูลโลโก้เข้าไป
                speed={30}            // ความเร็วในการเลื่อน (30 หน่วย)
                direction="left"      // ทิศทางการเลื่อน
                logoHeight={42}       // ความสูงของแต่ละโลโก้
                gap={60}              // ระยะห่างระหว่างโลโก้ (pixel)
                hoverSpeed={1}        // ความเร็วเมื่อเอาเมาส์ชี้ (0 = หยุด)
                scaleOnHover          // ให้ขยายเล็กน้อยเมื่อเอาเมาส์ชี้
                fadeOut               // ให้ขอบซ้ายขวามีการจางหาย
                fadeOutColor="transparent" // สีที่จะใช้จางหาย (transparent = โปร่งใส)
                ariaLabel="Technology partners" // คำอธิบายสำหรับ Screen Reader
            />
        </div>
    );
}

export default LogoTech; // ส่งออกเพื่อให้ไฟล์อื่นเรียกใช้ได้
/**
 * =========================================================================
 * SEPARATE ARCHIVE FILE ASSET: glazing_engine.test.js (INTEGRITY TESTS)
 * =========================================================================
 */
(function () {
    console.clear();
    console.log("%c🧪 [TEST RUNNER] Initializing CNC & Glazing String Integrity Tests...", "color: #00bcd4; font-weight: bold; font-size: 14px;");

    let passed = 0;
    let failed = 0;

    // Reporting utility function
    function assert(testName, condition) {
        if (condition) {
            passed++;
            console.log(`%c✔ PASS: ${testName}`, "color: #4caf50; font-size: 11px;");
        } else {
            failed++;
            console.error(`❌ FAIL: ${testName}`);
        }
    }

    try {
        // =========================================================================
        // --- TEST CASE 1: GLZ_CODE String Validation (No Leaks / Holes) ---
        // =========================================================================
        // 1. Setup specific configurations to force a standard glazing code generation
        setState("GLASS_SHAPE", "ranch");
        setState("GLASS_TYPE", "G01");
        setState("GLASS_INSERT", "NONE");
        setState("GLASS_TEMPERED", "NONE");
        setState("RAYNOR_DOOR", "N");
        setState("FACE", "C");
        
        // Mock a 4-window active selection layout
        window.getSectionInfo = function() {
            return [{ enabled: [true, true, true, true], glass_qty: 4, mixed_panels: [] }];
        };

        // Mock state registers for structural bundle lookups
        setState("SB1_SPNUM", "SB-PART-123");
        setState("BUNDLE1_SC1_SPNUM", "SC-INT01");
        setState("EXTERIOR_FRAME_1", "EXT-FRM");
        setState("WINDOW_1", "WIN-CLEAR");
        setState("INTERIOR_FRAME_1", "INT-FRM");
        setState("SCREWS", "SCR-99");
        setState("INSERT_1", "INS-0");
        
        // Mock the glass quantities storage variables inside your register memory
        setState("GLASS_QTY_B1_SC1", 4);
        setState("GLASS_QTY_B1_SC1_TEMP_OR_MIXED", 0);

        // 2. Execute the function block from File 4
        const actualGlzString = buildGlzCode(1);

        // 3. Asset Assertions (Inspecting for Empty or Broken Strings)
        assert("GLZ_CODE is not empty", actualGlzString !== "" && actualGlzString !== null);
        
        if (actualGlzString) {
            assert("GLZ_CODE contains zero undefined references", !actualGlzString.includes("undefined"));
            assert("GLZ_CODE contains zero NaN values", !actualGlzString.includes("NaN"));
            assert("GLZ_CODE does not contain empty comma holes (,,)", !actualGlzString.includes(",,"));
            assert("GLZ_CODE does not end with a trailing raw comma", !actualGlzString.endsWith(","));
            
            // Structural layout verification
            const totalCommas = (actualGlzString.match(/,/g) || []).length;
            assert("GLZ_CODE contains exactly the correct number of structural elements (7 values / 6 commas)", totalCommas === 6);
            console.log(`   [Captured Output]: "${actualGlzString}"`);
        }


        // =========================================================================
        // --- TEST CASE 2: getCNCString Format Validation ---
        // =========================================================================
        // 1. Setup input coordinates matrices 
        setState("DOOR_THICKNESS", 2.00);
        setState("WIDTH", 192);
        setState("END_CAPS", "Y");
        
        // Mock active section tracking arrays
        window.getSectionInfo = function() {
            return [{ enabled: [true, true, false, false, false, false, false, false, false, false], max_window_qty: 4, mixed_panels: [] }];
        };

        // Pre-allocate mock RLL position coordinates cache entries natively
        if (typeof SECTION_RLL_VALUES !== "undefined") {
            SECTION_RLL_VALUES[0] = [12.50, 34.25, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        }

        // 2. Execute calculation
        const actualCncString = getCNCString(24, "SC-INT01", 1);

        // 3. Asset Assertions
        assert("CNC string is not empty", actualCncString !== "" && actualCncString !== null);

        if (actualCncString) {
            assert("CNC string contains zero undefined leaks", !actualCncString.includes("undefined"));
            assert("CNC string contains zero NaN rendering errors", !actualCncString.includes("NaN"));
            
            // Notice: getCNCString allows valid trailing formatting structures like zero matrices (e.g. ,0,0,0,0,0)
            // But we must confirm no broken elements exist near the metadata tags
            assert("CNC string correctly appends the LR alignment suffix", actualCncString.includes(",LR,"));
            
            // Split up the elements to inspect data positions
            const elements = actualCncString.split(",");
            assert("CNC string header starts with the target SC part number", elements[0] === "SC-INT01");
            assert("CNC string header identifies door thickness correctly", elements[1] === "2");
            assert("CNC string counts the active window elements exactly", elements[21] === "2"); // 22nd element inside the production formatting schema
            
            console.log(`   [Captured Output Header]: "${elements.slice(0, 6).join(",")},..."`);
        }

    } catch (globalTestException) {
        failed++;
        console.error("❌ Critical Test failure: String inspection routine broke on an exception error:", globalTestException);
    }

    // Pass outputs down to your lifecycle validation hooks inside File 5
    window.testSuiteResults = { passed: passed, failed: failed };
    console.log(`\n%c🏁 Integrity Assessment Complete. Passed: ${passed} | Failed: ${failed}`, 
        `color: ${failed > 0 ? '#f44336' : '#4caf50'}; font-weight: bold; font-size: 13px;`
    );
})();

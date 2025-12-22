'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function GTMTestPage() {
    const [testResults, setTestResults] = useState('');

    const checkGTMLoaded = () => {
        const gtmScript = document.querySelector('script[src*="googletagmanager.com/gtm.js"]');

        if (gtmScript) {
            setTestResults(`
        <div style="color: green; font-weight: bold;">✅ GTM Script is loaded!</div>
        <div style="margin-top: 10px; color: #666;">Script URL: ${gtmScript.src}</div>
      `);
        } else {
            setTestResults(`
        <div style="color: red; font-weight: bold;">❌ GTM Script NOT found!</div>
        <div style="margin-top: 10px; color: #666;">Check console for errors</div>
      `);
        }
    };

    const checkDataLayer = () => {
        if (typeof window.dataLayer !== 'undefined') {
            const gtmEvents = window.dataLayer.filter(item => item['gtm.start'] || item.event);
            setTestResults(`
        <div style="color: green; font-weight: bold;">✅ DataLayer is defined!</div>
        <div style="margin-top: 10px; color: #666;">
          Total items: ${window.dataLayer.length}<br>
          GTM Events: ${gtmEvents.length}<br>
        </div>
      `);
            console.log('📊 DataLayer contents:', window.dataLayer);
        } else {
            setTestResults(`
        <div style="color: red; font-weight: bold;">❌ DataLayer NOT defined!</div>
      `);
        }
    };

    const sendTestEvent = () => {
        if (typeof window.dataLayer !== 'undefined') {
            window.dataLayer.push({
                event: 'test_gtm_verification',
                test_timestamp: new Date().toISOString(),
                test_page: window.location.pathname
            });

            setTestResults(`
        <div style="color: green; font-weight: bold;">✅ Test event sent!</div>
        <div style="margin-top: 10px; color: #666;">
          Event: 'test_gtm_verification'<br>
          Check GTM Preview mode to see the event<br>
          Check console for dataLayer contents
        </div>
      `);
            console.log('✅ Test event sent to dataLayer');
            console.log('📊 Current dataLayer:', window.dataLayer);
        } else {
            setTestResults(`
        <div style="color: red; font-weight: bold;">❌ Cannot send event - DataLayer not found!</div>
      `);
        }
    };

    // Auto-run first test on component mount
    useEffect(() => {
        setTimeout(() => {
            checkGTMLoaded();
        }, 1000);
    }, []);

    return (
        <div style={{
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '20px',
            background: '#f5f5f5',
            minHeight: '100vh'
        }}>
            <div style={{
                background: 'white',
                padding: '30px',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
                <h1 style={{
                    color: '#2d4a22',
                    borderBottom: '3px solid #2d4a22',
                    paddingBottom: '10px'
                }}>
                    🏷️ GTM Coverage Verification for Nature Medica
                </h1>
                <p><strong>Container ID:</strong> <code>GTM-TWJVCM2P</code></p>

                {/* Automated Tests */}
                <div style={{
                    margin: '20px 0',
                    padding: '20px',
                    background: '#f9f9f9',
                    borderLeft: '4px solid #2d4a22',
                    borderRadius: '4px'
                }}>
                    <h2>✅ Automated Tests</h2>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <button
                            onClick={checkGTMLoaded}
                            style={{
                                background: '#2d4a22',
                                color: 'white',
                                border: 'none',
                                padding: '12px 24px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '16px'
                            }}
                        >
                            1. Check if GTM is Loaded
                        </button>
                        <button
                            onClick={checkDataLayer}
                            style={{
                                background: '#2d4a22',
                                color: 'white',
                                border: 'none',
                                padding: '12px 24px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '16px'
                            }}
                        >
                            2. Check DataLayer
                        </button>
                        <button
                            onClick={sendTestEvent}
                            style={{
                                background: '#2d4a22',
                                color: 'white',
                                border: 'none',
                                padding: '12px 24px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '16px'
                            }}
                        >
                            3. Send Test Event
                        </button>
                    </div>
                    <div
                        style={{ marginTop: '15px' }}
                        dangerouslySetInnerHTML={{ __html: testResults }}
                    />
                </div>

                {/* Manual Steps */}
                <div style={{
                    margin: '20px 0',
                    padding: '20px',
                    background: '#f9f9f9',
                    borderLeft: '4px solid #2d4a22',
                    borderRadius: '4px'
                }}>
                    <h2>📋 Manual Verification Steps</h2>
                    <ol>
                        <li>Open <strong>DevTools Console</strong> (F12 or Cmd+Option+I)</li>
                        <li>Run: <code>console.log(window.dataLayer)</code></li>
                        <li>Look for GTM events in the array</li>
                        <li>Install <a href="https://chrome.google.com/webstore/detail/tag-assistant-legacy-by-g/kejbdjndbnbjgmefkgdddjlbokphdefk" target="_blank" style={{ color: '#2d4a22' }}>Google Tag Assistant</a></li>
                    </ol>
                </div>

                {/* Pages to Test */}
                <div style={{
                    margin: '20px 0',
                    padding: '20px',
                    background: '#f9f9f9',
                    borderLeft: '4px solid #2d4a22',
                    borderRadius: '4px'
                }}>
                    <h2>🔗 Pages to Test</h2>

                    <h3>Public Pages (Should have GTM ✅)</h3>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {[
                            { href: '/', label: 'Homepage' },
                            { href: '/products', label: 'Products' },
                            { href: '/cart', label: 'Cart' },
                            { href: '/about', label: 'About' },
                            { href: '/contact', label: 'Contact' },
                            { href: '/auth/login', label: 'Login' }
                        ].map(page => (
                            <li key={page.href} style={{
                                padding: '10px',
                                margin: '5px 0',
                                background: 'white',
                                borderRadius: '4px',
                                border: '1px solid #ddd'
                            }}>
                                <Link href={page.href} style={{ color: '#2d4a22', textDecoration: 'none' }}>
                                    {page.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <h3 style={{ marginTop: '20px' }}>Admin Pages (Previously Untagged - Now Fixed ✅)</h3>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {[
                            { href: '/admin/login', label: 'Admin Login' },
                            { href: '/admin', label: 'Admin Dashboard' },
                            { href: '/admin/products', label: 'Admin Products' },
                            { href: '/admin/orders', label: 'Admin Orders' }
                        ].map(page => (
                            <li key={page.href} style={{
                                padding: '10px',
                                margin: '5px 0',
                                background: 'white',
                                borderRadius: '4px',
                                border: '1px solid #ddd'
                            }}>
                                <Link href={page.href} style={{ color: '#2d4a22', textDecoration: 'none' }}>
                                    {page.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Console Commands */}
                <div style={{
                    margin: '20px 0',
                    padding: '20px',
                    background: '#f9f9f9',
                    borderLeft: '4px solid #2d4a22',
                    borderRadius: '4px'
                }}>
                    <h2>📊 Console Commands</h2>
                    <p>Copy and paste these commands into your browser console to verify GTM:</p>

                    <h4>Check if GTM Script is Loaded:</h4>
                    <pre style={{
                        background: '#1e1e1e',
                        color: '#d4d4d4',
                        padding: '15px',
                        borderRadius: '6px',
                        overflow: 'auto'
                    }}>
                        {`!!document.querySelector('script[src*="googletagmanager.com/gtm.js"]')
// Should return: true`}
                    </pre>

                    <h4>Check DataLayer:</h4>
                    <pre style={{
                        background: '#1e1e1e',
                        color: '#d4d4d4',
                        padding: '15px',
                        borderRadius: '6px',
                        overflow: 'auto'
                    }}>
                        {`console.log(window.dataLayer);
// Should show array with events`}
                    </pre>

                    <h4>Check GTM Container ID:</h4>
                    <pre style={{
                        background: '#1e1e1e',
                        color: '#d4d4d4',
                        padding: '15px',
                        borderRadius: '6px',
                        overflow: 'auto'
                    }}>
                        {`window.dataLayer.filter(item => item['gtm.start'])
// Should show GTM-TWJVCM2P container initialization`}
                    </pre>
                </div>

                {/* Back to Home */}
                <div style={{ marginTop: '30px', textAlign: 'center' }}>
                    <Link
                        href="/"
                        style={{
                            display: 'inline-block',
                            background: '#2d4a22',
                            color: 'white',
                            padding: '12px 24px',
                            borderRadius: '6px',
                            textDecoration: 'none',
                            fontSize: '16px'
                        }}
                    >
                        ← Back to Homepage
                    </Link>
                </div>
            </div>
        </div>
    );
}

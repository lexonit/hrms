'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { Card, Button, Badge, Input } from '@/components/ui';
import { Download, CheckCircle, Clock, DollarSign, Filter } from 'lucide-react';
import { PayrollStatus, UserRole, Payroll } from '@/types';
import { motion } from 'framer-motion';

/**
 * Payroll Module Component
 * Manage salary slips, deductions, and payment status
 */
export const PayrollModule: React.FC = () => {
  const { currentUser, payrolls, users, markPayrollPaid } = useStore();
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handleDownloadPayslip = (payroll: Payroll) => {
    const user = users.find((u) => u.id === payroll.userId);
    if (!user) return;

    const totalAllowances = Object.values(payroll.allowances).reduce((a, b) => a + b, 0);
    const totalDeductions = Object.values(payroll.deductions).reduce((a, b) => a + b, 0);

    const payslipHTML = `
      <html>
        <head>
          <title>Payslip - ${user.name} - ${payroll.month}</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 40px; }
            .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 30px; }
            .company-name { font-size: 28px; font-weight: 900; letter-spacing: 1px; color: #000; }
            .payslip-title { font-size: 18px; text-transform: uppercase; color: #666; margin-top: 5px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 30px; }
            .section { background: #f8f9fa; padding: 20px; border-radius: 8px; border: 1px solid #e9ecef; }
            .section-title { font-weight: bold; font-size: 14px; text-transform: uppercase; border-bottom: 1px solid #dee2e6; padding-bottom: 8px; margin-bottom: 15px; color: #495057; }
            .row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
            .total-row { font-weight: bold; border-top: 1px solid #ccc; padding-top: 10px; margin-top: 10px; font-size: 15px; }
            .net-pay { text-align: center; background: #e3f2fd; padding: 25px; border-radius: 8px; border: 1px solid #90caf9; margin-top: 30px; }
            .net-pay-label { font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #1976d2; }
            .net-pay-amount { font-size: 32px; font-weight: 900; color: #0d47a1; margin-top: 5px; }
            .footer { margin-top: 50px; font-size: 11px; text-align: center; color: #999; border-top: 1px solid #eee; padding-top: 20px; }
            @media print {
              body { -webkit-print-color-adjust: exact; padding: 20px; }
              .section, .net-pay { border: 1px solid #ddd !important; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">NEXUS HRM INC.</div>
            <div class="payslip-title">Salary Slip for ${payroll.month}</div>
          </div>

          <div class="grid">
            <div class="section">
              <div class="section-title">Employee Summary</div>
              <div class="row"><span>Name</span> <strong>${user.name}</strong></div>
              <div class="row"><span>Employee ID</span> <span>${user.id}</span></div>
              <div class="row"><span>Department</span> <span>${user.department}</span></div>
              <div class="row"><span>Designation</span> <span>${user.designation}</span></div>
            </div>
            <div class="section">
              <div class="section-title">Payment Info</div>
              <div class="row"><span>Pay Period</span> <span>${payroll.month}</span></div>
              <div class="row"><span>Pay Date</span> <span>${payroll.paymentDate || 'Processing'}</span></div>
              <div class="row"><span>Status</span> <strong style="text-transform:uppercase">${payroll.status}</strong></div>
            </div>
          </div>

          <div class="grid">
            <div class="section">
              <div class="section-title">Earnings</div>
              <div class="row"><span>Basic Salary</span> <span>${formatCurrency(payroll.basicSalary)}</span></div>
              <div class="row"><span>HRA</span> <span>${formatCurrency(payroll.allowances.hra)}</span></div>
              <div class="row"><span>Transport</span> <span>${formatCurrency(payroll.allowances.transport)}</span></div>
              <div class="row"><span>Special Allowance</span> <span>${formatCurrency(payroll.allowances.special)}</span></div>
              <div class="row"><span>Bonus</span> <span>${formatCurrency(payroll.allowances.bonus)}</span></div>
              <div class="row total-row"><span>Total Earnings</span> <span>${formatCurrency(payroll.basicSalary + totalAllowances)}</span></div>
            </div>
            <div class="section">
              <div class="section-title">Deductions</div>
              <div class="row"><span>Income Tax</span> <span>${formatCurrency(payroll.deductions.tax)}</span></div>
              <div class="row"><span>Provident Fund</span> <span>${formatCurrency(payroll.deductions.pf)}</span></div>
              <div class="row"><span>Insurance</span> <span>${formatCurrency(payroll.deductions.insurance)}</span></div>
              <div class="row total-row"><span>Total Deductions</span> <span>${formatCurrency(totalDeductions)}</span></div>
            </div>
          </div>

          <div class="net-pay">
            <div class="net-pay-label">Net Payable Amount</div>
            <div class="net-pay-amount">${formatCurrency(payroll.netSalary)}</div>
            <div style="font-size: 13px; color: #555; margin-top: 5px;">
              (Total Earnings - Total Deductions)
            </div>
          </div>

          <div class="footer">
            <p>This is a computer-generated document and does not require a signature.</p>
            <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
            <p>Nexus HRM Inc. | 123 Tech Park, Silicon Valley, CA | www.nexushrm.com</p>
          </div>

          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(payslipHTML);
      printWindow.document.close();
    }
  };

  // Filter payrolls based on role and selected month
  const filteredPayrolls = payrolls.filter((p) => {
    // Role filter
    if (
      currentUser?.role !== UserRole.SUPER_ADMIN &&
      currentUser?.role !== UserRole.HR_ADMIN &&
      p.userId !== currentUser?.id
    ) {
      return false;
    }

    // Month filter
    if (selectedMonth && p.month !== selectedMonth) {
      return false;
    }

    return true;
  });

  const getStatusColor = (status: PayrollStatus) => {
    switch (status) {
      case PayrollStatus.PAID:
        return 'bg-green-100 text-green-800 border-green-200';
      case PayrollStatus.PROCESSED:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUserName = (userId: string) => {
    return users.find((u) => u.id === userId)?.name || 'Unknown User';
  };

  // Calculate unique months for filter
  const availableMonths = Array.from(new Set(payrolls.map((p) => p.month))).sort().reverse();

  return (
    <div className="space-y-6 pb-32">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold">Payroll & Compensation</h2>
          <p className="text-sm text-muted-foreground">
            View salary slips, tax deductions, and payment history.
          </p>
        </div>
        <div className="flex items-center gap-2">
           <select
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="">All Months</option>
            {availableMonths.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
          {(currentUser?.role === UserRole.SUPER_ADMIN || currentUser?.role === UserRole.HR_ADMIN) && (
             <Button className="rounded-xl">
              <DollarSign size={18} className="mr-2" /> Process New
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPayrolls.map((payroll) => (
          <motion.div
            key={payroll.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="overflow-hidden border-l-4 border-l-primary hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{payroll.month}</h3>
                    <p className="text-sm text-muted-foreground">{getUserName(payroll.userId)}</p>
                  </div>
                  <Badge variant="secondary" className={getStatusColor(payroll.status)}>
                    {payroll.status}
                  </Badge>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Basic Salary</span>
                    <span className="font-medium">{formatCurrency(payroll.basicSalary)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Allowances</span>
                    <span className="text-green-600 font-medium">
                      +{formatCurrency(
                        Object.values(payroll.allowances).reduce((a, b) => a + b, 0)
                      )}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Deductions</span>
                    <span className="text-red-500 font-medium">
                      -{formatCurrency(
                        Object.values(payroll.deductions).reduce((a, b) => a + b, 0)
                      )}
                    </span>
                  </div>

                  <div className="border-t pt-3 flex justify-between items-center">
                    <span className="font-bold">Net Salary</span>
                    <span className="font-bold text-lg text-primary">
                      {formatCurrency(payroll.netSalary)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="w-full text-xs h-9"
                    onClick={() => handleDownloadPayslip(payroll)}
                  >
                    <Download size={14} className="mr-2" /> Payslip
                  </Button>
                  
                  {payroll.status !== PayrollStatus.PAID && 
                   (currentUser?.role === UserRole.SUPER_ADMIN || currentUser?.role === UserRole.HR_ADMIN) && (
                    <Button 
                      className="w-full text-xs h-9" 
                      onClick={() => markPayrollPaid(payroll.id)}
                    >
                      <CheckCircle size={14} className="mr-2" /> Mark Paid
                    </Button>
                  )}
                </div>
              </div>
              
              {payroll.paymentDate && (
                <div className="bg-accent/10 px-6 py-2 text-xs text-muted-foreground flex items-center justify-between">
                   <span className="flex items-center">
                    <Clock size={12} className="mr-1" /> Paid on
                   </span>
                   <span>{payroll.paymentDate}</span>
                </div>
              )}
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredPayrolls.length === 0 && (
         <div className="text-center py-20 text-muted-foreground">
           <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-20" />
           <p>No payroll records found for the selection.</p>
         </div>
      )}
    </div>
  );
};

"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, HelpCircle } from "lucide-react"
import { useTranslations } from "next-intl"

interface FAQItemProps {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
  index: number
}

function FAQItem({ question, answer, isOpen, onToggle, index }: FAQItemProps) {
  return (
    <motion.div
      className="border-3 border-foreground rounded-xl overflow-hidden shadow-[3px_3px_0_var(--foreground)] hover:shadow-[5px_5px_0_var(--foreground)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-200"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <button
        onClick={onToggle}
        className={`w-full px-6 py-4 flex items-center justify-between text-left font-bold transition-colors ${
          isOpen ? "bg-primary text-primary-foreground" : "bg-card hover:bg-muted"
        }`}
      >
        <span className="flex items-center gap-3">
          <span className={`
            w-8 h-8 flex items-center justify-center rounded-lg border-2 border-foreground text-sm font-bold
            ${isOpen ? "bg-foreground text-primary" : "bg-accent text-accent-foreground"}
          `}>
            {index + 1}
          </span>
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-6 py-4 bg-card border-t-3 border-foreground">
              <div 
                className="text-muted-foreground whitespace-pre-line faq-content"
                dangerouslySetInnerHTML={{ 
                  __html: answer
                    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>')
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function FAQ() {
  const t = useTranslations("faq")
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    { questionKey: "items.howItWorks.question", answerKey: "items.howItWorks.answer" },
    { questionKey: "items.geminiOptimization.question", answerKey: "items.geminiOptimization.answer" },
    { questionKey: "items.geminiSaveMethod.question", answerKey: "items.geminiSaveMethod.answer" },
    { questionKey: "items.lamaOptimization.question", answerKey: "items.lamaOptimization.answer" },
    { questionKey: "items.privacy.question", answerKey: "items.privacy.answer" },
    { questionKey: "items.formats.question", answerKey: "items.formats.answer" },
    { questionKey: "items.modelSize.question", answerKey: "items.modelSize.answer" },
    { questionKey: "items.limitations.question", answerKey: "items.limitations.answer" },
  ]

  return (
    <section className="py-20 px-4 bg-muted/30 relative">
      {/* 装饰背景 */}
      <div className="absolute top-0 left-0 right-0 h-3 bg-foreground" />
      
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* 徽章 */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground border-3 border-foreground rounded-full shadow-[3px_3px_0_var(--foreground)] mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <HelpCircle className="w-5 h-5" />
            <span className="text-sm font-bold">{t("badge")}</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {t("title")}
            <span className="relative inline-block mx-2">
              <span className="relative z-10">{t("highlight")}</span>
              <span className="absolute -bottom-1 left-0 right-0 h-3 bg-accent -z-0 rotate-1" />
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("description")}
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={t(faq.questionKey)}
              answer={t(faq.answerKey)}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
              index={index}
            />
          ))}
        </div>

        {/* 底部提示 */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-sm text-muted-foreground">
            {t("moreQuestions")}{" "}
            <a
              href="https://github.com/isboyjc/cleanup/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-bold hover:underline"
            >
              GitHub Issues
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  )
}


# Resume Prompt Injector: AI Security Research Tool

A comprehensive research tool for studying prompt injection vulnerabilities in AI systems that process resumes and documents. This tool is based on research presented in "Trust No AI: Prompt Injection Along The CIA Security Triad" by Johann Rehberger.

## ⚠️ Important Disclaimer

This tool is provided **for educational and research purposes only**. The authors do not condone or encourage using this tool for:

- Deceiving recruitment systems
- Gaining unfair advantages in job applications
- Any unethical or potentially illegal activities

Use of this tool should be limited to:
- Security research
- Testing the robustness of AI systems
- Educational demonstrations
- Raising awareness about AI vulnerabilities

## Features

### Comprehensive Injection Techniques

- **Invisible Text Injection**: Standard technique using invisible PDF text
- **ASCII Smuggling**: Advanced technique using Unicode tag characters
- **Conditional Prompt Injection**: Context-aware prompts that activate based on specific conditions
- **Hybrid Approaches**: Combining multiple techniques for increased resilience

### Security Research Tools

- **PDF Analyzer**: Detect and analyze prompt injections in existing PDFs
- **Comparison Tool**: Compare original and injected documents with difference highlighting
- **CIA Impact Matrix**: Educational resources on security impacts along the CIA triad
- **Security Scenarios**: Pre-built scenarios demonstrating various attack vectors

### Educational Components

- **Security Impact Guide**: Detailed information on how prompt injections affect confidentiality, integrity, and availability
- **Mitigation Strategies**: Best practices for defending against prompt injection attacks
- **Research Ethics**: Guidelines for responsible security research
- **CIA Security Triad**: Framework for understanding security implications

## Technical Details

### Installation

#### Prerequisites

- Python 3.7 or higher
- pip (Python package installer)

#### Install from source

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/resume-prompt-injector.git
   cd resume-prompt-injector
   ```

2. Install the package:
   ```
   pip install -e .
   ```

### Dependencies

The following Python packages will be automatically installed:
- reportlab
- PyPDF2
- tqdm
- (tkinter is included with most Python installations)

## Usage

### Graphical User Interface (Recommended)

The most comprehensive way to use the tool is through its graphical interface:

```bash
resume-gui
```

The GUI provides access to all features:
- Injection with different techniques
- PDF analysis
- Educational resources
- Security impact assessment

### Command Line Interface

#### Process a single resume:

```bash
resume-injector inject input.pdf output.pdf --method invisible_text --text "Your injection text"
```

#### Analyze a PDF for injections:

```bash
resume-injector analyze suspicious.pdf --output analysis.json
```

#### Batch process multiple resumes:

```bash
resume-batch batch ./resumes/ --output ./processed/ --method ascii_smuggling
```

## Understanding the CIA Security Triad

This tool is organized around the CIA security triad framework from the research paper:

### Confidentiality

Prompt injections can breach confidentiality by:
- Revealing system prompts and instructions
- Causing data exfiltration through generated content
- Triggering tool invocations that access sensitive data

### Integrity

Prompt injections compromise integrity by:
- Manipulating AI system outputs
- Creating inconsistent processing based on conditions
- Generating deceptive content invisible to humans

### Availability

Prompt injections affect availability through:
- Resource-intensive processing
- Causing system refusals or timeouts
- Creating persistent denial of service conditions

## Research Applications

This tool enables researchers to:
- Test the effectiveness of different injection techniques
- Study how AI systems process invisible or hidden text
- Evaluate defensive measures and mitigations
- Understand the security implications of prompt injection vulnerabilities

## Responsible Disclosure

If you discover vulnerabilities in real AI systems using this tool, please practice responsible disclosure:
1. Contact the affected vendor directly
2. Provide clear documentation of the issue
3. Allow reasonable time for remediation before public disclosure
4. Follow the vendor's security disclosure policies

## Contributing

Contributions that improve the tool's capabilities for educational and research purposes are welcome. Please submit pull requests with clear explanations of the changes.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

This project was inspired by research on prompt injection vulnerabilities in AI systems, particularly the work presented in "Trust No AI: Prompt Injection Along The CIA Security Triad" by Johann Rehberger. We gratefully acknowledge the foundational research that has helped illuminate these security challenges.

## Additional Resources

For those interested in learning more about prompt injection security:

1. **Original Research**: Read "Trust No AI: Prompt Injection Along The CIA Security Triad" for a comprehensive overview of the security implications of prompt injection attacks.

2. **Embracethered.com**: Visit Johann Rehberger's website for detailed documentation of real-world prompt injection vulnerabilities and their mitigations.

3. **NIST AI Risk Management Framework**: The National Institute of Standards and Technology provides guidance on managing risks associated with AI systems, including security considerations.

4. **Responsible AI Practices**: Major AI vendors and research organizations publish guidelines on responsible AI development and usage, which often include security recommendations.

By combining technical tools with educational resources, we hope this project contributes to a more secure AI ecosystem where vulnerabilities are understood and mitigated before they can be exploited in production systems.